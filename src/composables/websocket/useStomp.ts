import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { ref, watch } from "vue";

import { useUserStoreHook } from "@/stores/user";
import { AuthStorage } from "@/utils/auth";

export interface UseStompOptions {
  /** WebSocket 地址，不传时使用 VITE_APP_WS_ENDPOINT 环境变量 */
  brokerURL?: string;
  /** 显式指定 token。**一般不要传**：不传时每次建连前从 AuthStorage 实时取；传固定值＝凭据钉死在创建那刻 */
  token?: string;
  login?: string;
  /** 重连延迟，单位毫秒，默认为 8000 */
  reconnectDelay?: number;
  /** 连接超时时间，单位毫秒，默认为 10000 */
  connectionTimeout?: number;
  /** 是否开启指数退避重连策略 */
  useExponentialBackoff?: boolean;
  /** 最大重连次数，默认为 5 */
  maxReconnectAttempts?: number;
  /** 最大重连延迟，单位毫秒，默认为 60000 */
  maxReconnectDelay?: number;
  /** 是否开启调试日志 */
  debug?: boolean;
}

/**
 * 创建一条 STOMP 连接
 *
 * **非单例**：每次调用新建一条连接，实例由调用方持有并负责清理
 * （在线人数由 useOnlineCount 持有）。与 createSseChannel 同形。
 */
export function createStompClient(options: UseStompOptions = {}) {
  // 默认值：brokerURL 从环境变量中获取，token 从 getAccessToken() 获取
  const defaultBrokerURL = import.meta.env.VITE_APP_WS_ENDPOINT || "";

  const brokerURL = ref(options.brokerURL ?? defaultBrokerURL);
  // 默认配置参数
  const reconnectDelay = options.reconnectDelay ?? 15000; // 默认15秒重连间隔
  const connectionTimeout = options.connectionTimeout ?? 10000;
  const useExponentialBackoff = options.useExponentialBackoff ?? false;
  const maxReconnectAttempts = options.maxReconnectAttempts ?? 3; // 最多重连3次
  const maxReconnectDelay = options.maxReconnectDelay ?? 60000;

  // 连接状态标记
  const isConnected = ref(false);
  // 重连尝试次数
  const reconnectCount = ref(0);
  // 重连计时器
  let reconnectTimer: any = null;
  // 连接超时计时器
  let connectionTimeoutTimer: any = null;
  // 活订阅与订阅意图，均以 destination 为 key（同一主题只保留一个回调）。
  // 意图单独记一份：stompjs 的订阅随连接失效，重连后由本 hook 自动恢复，
  // 调用方不必再 watch 连接状态手动重订阅
  const subscriptions = new Map<string, StompSubscription>();
  const desires = new Map<string, (_message: IMessage) => void>();

  // 用于保存 STOMP 客户端的实例
  const client = ref<Client | null>(null);
  // 防止重复连接的标志
  let isConnecting = false;
  let isManualDisconnect = false;

  /** 组装 CONNECT 帧的凭据头。每次建连前调用（见 beforeConnect）：token 会被续期，只有当前这份有效 */
  const buildConnectHeaders = () => {
    const login = options.login ?? AuthStorage.getUid() ?? "";
    return {
      login,
      passcode: options.token ?? AuthStorage.getAccessToken() ?? "",
      client: login,
    };
  };

  /**
   * 初始化 STOMP 客户端
   */
  const initializeClient = () => {
    // 如果客户端已存在且正在连接或已连接，直接返回
    if (client.value && (client.value.active || client.value.connected)) {
      console.log("STOMP客户端已存在且处于活动状态，跳过初始化");
      return;
    }

    // 检查WebSocket端点是否配置
    if (!brokerURL.value) {
      console.warn("WebSocket连接失败: 未配置WebSocket端点URL");
      return;
    }

    // 如果有旧的客户端，先清理
    if (client.value) {
      try {
        client.value.deactivate();
      } catch (error) {
        console.warn("清理旧客户端时出错:", error);
      }
      client.value = null;
    }

    // 创建 STOMP 客户端
    client.value = new Client({
      brokerURL: brokerURL.value,
      connectHeaders: buildConnectHeaders(),
      debug: options.debug ? console.log : () => {},
      reconnectDelay: 0, // 禁用内置重连机制，使用自定义重连
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // 每次建连前重取凭据：token 会在会话中被续期，创建客户端时取的那份很快过期
    client.value.beforeConnect = async () => {
      if (client.value) {
        client.value.connectHeaders = buildConnectHeaders();
      }
    };

    // 设置连接监听器
    client.value.onConnect = () => {
      isConnected.value = true;
      isConnecting = false;
      reconnectCount.value = 0;
      clearTimeout(connectionTimeoutTimer);
      clearTimeout(reconnectTimer);
      console.log("WebSocket连接已建立");
      resubscribeAll();
    };

    // 设置断开连接监听器
    client.value.onDisconnect = () => {
      isConnected.value = false;
      isConnecting = false;
      console.log("WebSocket连接已断开");

      // 如果不是手动断开且未达到最大重连次数，则尝试重连
      if (!isManualDisconnect && reconnectCount.value < maxReconnectAttempts) {
        handleReconnect();
      }
    };

    // 设置 Web Socket 关闭监听器
    client.value.onWebSocketClose = (event) => {
      isConnected.value = false;
      isConnecting = false;
      console.log(`WebSocket已关闭: ${event?.code} ${event?.reason}`);

      // 如果是手动断开，不要重连
      if (isManualDisconnect) {
        console.log("手动断开连接，不进行重连");
        return;
      }

      // 如果是授权问题导致的关闭，尝试重连
      if (
        (event?.code === 1000 || event?.code === 1006 || event?.code === 1008) &&
        reconnectCount.value < maxReconnectAttempts
      ) {
        console.log("检测到连接异常关闭，将尝试重连");

        // 通过 handleReconnect 统一处理重连，避免重复计数
        handleReconnect();
      }
    };

    // 设置错误监听器
    client.value.onStompError = (frame) => {
      console.error("STOMP错误:", frame.headers, frame.body);
      isConnecting = false;

      // 授权错误：凭据可能只是过期，续期一次再重连（与 SSE 通道同一处理）
      if (/unauthorized|token/i.test(`${frame.headers?.message ?? ""} ${frame.body ?? ""}`)) {
        console.warn("WebSocket授权错误，尝试续期后重连");
        void recoverAuth();
      }
    };
  };

  /**
   * 处理重连逻辑
   */
  const handleReconnect = () => {
    // 如果已经在连接中或手动断开，不重连
    if (isConnecting || isManualDisconnect) {
      return;
    }

    if (reconnectCount.value >= maxReconnectAttempts) {
      console.error(`已达到最大重连次数(${maxReconnectAttempts})，停止重连`);
      return;
    }

    reconnectCount.value++;
    console.log(`准备重连(${reconnectCount.value}/${maxReconnectAttempts})...`);

    // 使用指数退避策略增加重连间隔
    const delay = useExponentialBackoff
      ? Math.min(reconnectDelay * Math.pow(2, reconnectCount.value - 1), maxReconnectDelay)
      : reconnectDelay;

    // 清除之前的计时器
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }

    // 设置重连计时器
    reconnectTimer = setTimeout(() => {
      if (!isConnected.value && !isManualDisconnect && !isConnecting) {
        console.log(`开始重连...`);
        connect();
      }
    }, delay);
  };

  /** 续期单飞标志：避免多次错误并发触发续期 */
  let refreshing = false;

  /** 凭据失效恢复：续期一次，成功即重连；失败才停止（登录态兜底由 axios 那条链路处理） */
  const recoverAuth = async () => {
    if (refreshing) {
      return;
    }
    refreshing = true;
    try {
      await useUserStoreHook().refreshTokenOnce();
      console.debug("WebSocket令牌续期成功，重新建立连接");
      isManualDisconnect = false;
      reconnectCount.value = 0;
      handleReconnect();
    } catch {
      console.warn("WebSocket令牌续期失败，停止重连");
      isManualDisconnect = true;
    } finally {
      refreshing = false;
    }
  };

  // 监听 brokerURL 的变化，若地址改变则重新初始化
  watch(brokerURL, (newURL, oldURL) => {
    if (newURL !== oldURL) {
      console.log(`brokerURL changed from ${oldURL} to ${newURL}`);
      // 断开当前连接，重新激活客户端
      if (client.value && client.value.connected) {
        client.value.deactivate();
      }
      brokerURL.value = newURL;
      initializeClient(); // 重新初始化客户端
    }
  });

  // 初始化客户端
  initializeClient();

  /**
   * 激活连接（如果已经连接或正在激活则直接返回）
   */
  const connect = () => {
    // 重置手动断开标志
    isManualDisconnect = false;

    // 检查是否有配置WebSocket端点
    if (!brokerURL.value) {
      console.error("WebSocket连接失败: 未配置WebSocket端点URL");
      return;
    }

    // 防止重复连接
    if (isConnecting) {
      console.log("WebSocket正在连接中，跳过重复连接请求");
      return;
    }

    if (!client.value) {
      initializeClient();
    }

    if (!client.value) {
      console.error("STOMP客户端初始化失败");
      return;
    }

    // 避免重复连接:检查是否已连接
    if (client.value.connected) {
      console.log("WebSocket已经连接,跳过重复连接");
      isConnected.value = true;
      return;
    }

    // 设置连接标志
    isConnecting = true;

    // 设置连接超时
    clearTimeout(connectionTimeoutTimer);
    connectionTimeoutTimer = setTimeout(() => {
      if (!isConnected.value && isConnecting) {
        console.warn("WebSocket连接超时");
        isConnecting = false;
        if (!isManualDisconnect && reconnectCount.value < maxReconnectAttempts) {
          handleReconnect();
        }
      }
    }, connectionTimeout);

    try {
      client.value.activate();
      console.log("正在建立WebSocket连接...");
    } catch (error) {
      console.error("激活WebSocket连接失败:", error);
      isConnecting = false;
    }
  };

  /**
   * 订阅指定主题，返回取消订阅函数（与 SSE 通道同形，调用方不必自管 id）
   *
   * 未连接时也能调用：意图会被记住，连接建立（含每次重连）后自动生效。
   */
  const subscribe = (destination: string, callback: (_message: IMessage) => void): (() => void) => {
    desires.set(destination, callback);
    openSubscription(destination);

    return () => {
      desires.delete(destination);
      closeSubscription(destination);
    };
  };

  /** 建立一条真实订阅（未连接时静默跳过，等重连后补） */
  const openSubscription = (destination: string) => {
    const callback = desires.get(destination);
    if (!callback || !client.value || !client.value.connected) {
      return;
    }
    try {
      const subscription = client.value.subscribe(destination, callback);
      subscriptions.set(destination, subscription);
      console.log(`订阅成功: ${destination}, ID: ${subscription.id}`);
    } catch (error) {
      console.error(`订阅 ${destination} 失败:`, error);
    }
  };

  /** 关闭某条真实订阅（不撤销意图） */
  const closeSubscription = (destination: string) => {
    const subscription = subscriptions.get(destination);
    if (!subscription) {
      return;
    }
    try {
      subscription.unsubscribe();
    } catch (error) {
      console.warn(`取消订阅 ${destination} 时出错:`, error);
    }
    subscriptions.delete(destination);
  };

  /** 重连后恢复全部订阅意图 */
  const resubscribeAll = () => {
    subscriptions.clear();
    for (const destination of desires.keys()) {
      openSubscription(destination);
    }
  };

  /**
   * 断开WebSocket连接
   */
  const disconnect = () => {
    // 设置手动断开标志
    isManualDisconnect = true;

    // 清除所有计时器
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    if (connectionTimeoutTimer) {
      clearTimeout(connectionTimeoutTimer);
      connectionTimeoutTimer = null;
    }

    // 只退掉当前连接上的活订阅；**订阅意图保留**——
    // 意图与连接解耦，下次 connect（含自动重连）后会由 resubscribeAll 恢复。
    // 与 SSE 通道同义：订阅随实例存活，只有 subscribe 返回的取消函数才真正移除它。
    for (const destination of Array.from(subscriptions.keys())) {
      closeSubscription(destination);
    }

    // 断开连接
    if (client.value) {
      try {
        if (client.value.connected || client.value.active) {
          client.value.deactivate();
          console.log("WebSocket连接已主动断开");
        }
      } catch (error) {
        console.error("断开WebSocket连接时出错:", error);
      }
      client.value = null;
    }

    isConnected.value = false;
    isConnecting = false;
    reconnectCount.value = 0;
  };

  return {
    client,
    isConnected,
    connect,
    subscribe,
    disconnect,
  };
}
