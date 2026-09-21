import { useUserStoreHook } from "@/stores/user";
import { AuthStorage } from "@/utils/auth";
import { buildRequestHeaders } from "@/utils/request";

/** SSE 连接配置选项 */
export interface UseSseOptions {
  /** SSE 连接地址，默认走 VITE_APP_BASE_API 代理 */
  url?: string;
  /** 是否在控制台打印调试日志 */
  debug?: boolean;
  /** 连接超时时间（ms），默认 10000 */
  connectionTimeout?: number;
  /** 重连间隔基数（ms），实际间隔 = min(基数 × 2^n, maxReconnectInterval) */
  reconnectInterval?: number;
  /** 重连间隔上限（ms），默认 120000 */
  maxReconnectInterval?: number;
  /** 最大重连次数，默认 -1；`<= 0` 表示一直重试 */
  maxReconnectAttempts?: number;
  /** 静默超时（ms），默认 45000 = 服务端心跳(15s)的 3 倍；超时未收到任何字节即重连，覆盖 TCP 半开 */
  staleTimeout?: number;
  /** 连接建立后的回调，用于"连上即补拉一次未读"这类补偿动作 */
  onOpen?: () => void;
}

/** SSE 事件处理器类型 */
type EventHandler = (data: unknown) => void;

/** SSE 流解析中间状态 */
type SseParseState = {
  currentEvent: string;
  currentData: string;
  buffer: string;
};

/** SSE 连接状态 */
export enum SseConnectionState {
  DISCONNECTED = "DISCONNECTED",
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
}

/**
 * SSE 的 Accept 值。
 *
 * 必须**精确**等于该字符串：go-zero 的超时包装用等值判断决定是否豁免长连接，
 * 附加上通配符之类会让流被当成普通请求套上超时，几十秒后即被掐断。
 */
const AcceptEventStream = "text/event-stream";

function createSseConnection(options: UseSseOptions = {}) {
  const baseUrl = import.meta.env.VITE_APP_BASE_API;
  const defaultUrl = `${baseUrl}/notify-messages/stream`;

  const config = {
    url: options.url ?? defaultUrl,
    debug: options.debug ?? false,
    connectionTimeout: options.connectionTimeout ?? 10000,
    reconnectInterval: options.reconnectInterval ?? 5000,
    maxReconnectInterval: options.maxReconnectInterval ?? 120000,
    maxReconnectAttempts: options.maxReconnectAttempts ?? -1,
    staleTimeout: options.staleTimeout ?? 45000,
    onOpen: options.onOpen,
  };

  const connectionState = ref<SseConnectionState>(SseConnectionState.DISCONNECTED);
  const isConnected = computed(() => connectionState.value === SseConnectionState.CONNECTED);

  let abortController: AbortController | null = null;
  let connectionTimeoutTimer: ReturnType<typeof setTimeout> | null = null;
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  /** 静默检测定时器：超时未收到任何字节即判定链路已死 */
  let staleTimer: ReturnType<typeof setTimeout> | null = null;
  /** 主动断开则不重连 */
  let isManualDisconnect = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let reconnectAttempts = 0;
  let currentReconnectInterval = config.reconnectInterval;
  /** 续期进行中标志，避免多条连接同时触发续期 */
  let refreshing = false;

  const eventHandlers = new Map<string, Set<EventHandler>>();

  const log = (...args: unknown[]) => {
    if (config.debug) {
      console.debug("[SSE]", ...args);
    }
  };
  const logError = (...args: unknown[]) => console.error("[SSE]", ...args);

  /** 清除定时器并返回 null，用于链式赋值 */
  const clearTimer = (timer: ReturnType<typeof setTimeout> | null): null => {
    if (timer) {
      clearTimeout(timer);
    }
    return null;
  };

  /** 重置重连状态：次数归零、间隔恢复基数 */
  const resetReconnectState = () => {
    reconnectAttempts = 0;
    currentReconnectInterval = config.reconnectInterval;
  };

  /** 收流过程中重置静默计时 */
  const armStaleTimer = () => {
    staleTimer = clearTimer(staleTimer);
    staleTimer = setTimeout(() => handleStale(), config.staleTimeout);
  };

  /** 静默超时：判定链路已死并重连 */
  const handleStale = () => {
    logError(`静默超过 ${config.staleTimeout}ms，判定链路已死，重连`);
    teardownStream();
    resetReconnectState();
    scheduleReconnect();
  };

  /** 拆掉当前这条流（中止请求、取消读取、清定时器），不决定是否重连 */
  const teardownStream = () => {
    staleTimer = clearTimer(staleTimer);
    reader?.cancel();
    reader = null;
    abortController?.abort();
    abortController = null;
    connectionState.value = SseConnectionState.DISCONNECTED;
  };

  /** 指数退避：当前间隔翻倍，不超过上限 */
  const advanceReconnectState = () => {
    currentReconnectInterval = Math.min(currentReconnectInterval * 2, config.maxReconnectInterval);
  };

  /** 分发 SSE 事件：先尝试 JSON.parse，失败则传原始字符串 */
  const flushSseEvent = (eventName: string, data: string) => {
    if (!data) return;
    const handlers = eventHandlers.get(eventName);
    if (handlers) {
      try {
        const parsed = JSON.parse(data);
        handlers.forEach((handler) => handler(parsed));
      } catch {
        handlers.forEach((handler) => handler(data));
      }
    }
    log(`收到事件[${eventName}]:`, data);
  };

  /** 解析单行 SSE 数据：区分 event/data/注释/空行（触发分发） */
  const handleSseLine = (line: string, state: SseParseState) => {
    if (line.startsWith(":")) return;
    if (line.startsWith("event:")) {
      state.currentEvent = line.slice(6).trim() || "message";
      return;
    }
    if (line.startsWith("data:")) {
      const dataLine = line.slice(5).trim();
      state.currentData = state.currentData ? `${state.currentData}\n${dataLine}` : dataLine;
      return;
    }
    if (line === "") {
      flushSseEvent(state.currentEvent, state.currentData);
      state.currentEvent = "message";
      state.currentData = "";
    }
  };

  /** 持续读取流数据并按行解析，异常时触发重连 */
  const consumeSseStream = async (streamReader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();
    const state: SseParseState = { currentEvent: "message", currentData: "", buffer: "" };

    try {
      while (true) {
        const { done, value } = await streamReader.read();
        if (done) {
          reader = null;
          connectionState.value = SseConnectionState.DISCONNECTED;
          log("SSE 连接已关闭");
          // 服务端正常结束（重启/网关回收）也要重连，否则一次重启即永久失联
          scheduleReconnect();
          return;
        }

        // 收到任何字节都算链路活着（含心跳注释行）
        armStaleTimer();

        state.buffer += decoder.decode(value, { stream: true });
        const lines = state.buffer.split("\n");
        state.buffer = lines.pop() || "";

        for (const line of lines) {
          handleSseLine(line, state);
        }
      }
    } catch (err) {
      reader = null;
      connectionState.value = SseConnectionState.DISCONNECTED;
      if (err instanceof Error && err.name === "AbortError") {
        log("SSE 流读取已主动断开");
      } else {
        logError("SSE 流读取错误:", err);
        scheduleReconnect();
      }
    }
  };

  /** 调度重连：指数退避，按 maxReconnectAttempts 决定是否停止 */
  const scheduleReconnect = () => {
    if (isManualDisconnect) return;

    if (config.maxReconnectAttempts > 0 && reconnectAttempts >= config.maxReconnectAttempts) {
      logError(`已达重连上限 ${config.maxReconnectAttempts} 次，停止重连`);
      return;
    }

    reconnectAttempts++;
    log(`将在 ${currentReconnectInterval}ms 后重试（第 ${reconnectAttempts} 次）`);

    reconnectTimer = clearTimer(reconnectTimer);
    reconnectTimer = setTimeout(() => {
      advanceReconnectState();
      connect();
    }, currentReconnectInterval);
  };

  /** 令牌失效：续期一次，成功即立刻重连，失败交给退避重连 */
  const handleUnauthorized = async (): Promise<void> => {
    connectionState.value = SseConnectionState.DISCONNECTED;

    if (refreshing) {
      return;
    }
    refreshing = true;
    try {
      await useUserStoreHook().refreshTokenOnce();
      log("令牌续期成功，重新建立 SSE 连接");
      resetReconnectState();
      connect();
    } catch {
      log("令牌续期失败，等待退避重连");
      scheduleReconnect();
    } finally {
      refreshing = false;
    }
  };

  /** 建立连接：带认证头 fetch → 超时检测 → 消费流；401/403 先续期 */
  const connect = async () => {
    isManualDisconnect = false;

    if (connectionState.value !== SseConnectionState.DISCONNECTED) {
      log(
        connectionState.value === SseConnectionState.CONNECTED
          ? "SSE 已连接，跳过重复连接"
          : "SSE 正在连接中，跳过重复连接"
      );
      return;
    }

    if (!AuthStorage.getAccessToken()) {
      log("未检测到有效令牌，稍后重试");
      reconnectTimer = clearTimer(reconnectTimer);
      reconnectTimer = setTimeout(() => connect(), config.reconnectInterval);
      return;
    }

    connectionState.value = SseConnectionState.CONNECTING;
    abortController = new AbortController();

    connectionTimeoutTimer = clearTimer(connectionTimeoutTimer);
    connectionTimeoutTimer = setTimeout(() => {
      if (connectionState.value === SseConnectionState.CONNECTING) {
        log("SSE 连接超时");
        // 这里必须用 teardownStream 而非 disconnect：后者会置"手动断开"标志，
        // 使紧随其后的 scheduleReconnect 直接返回，连接就此永久失联
        teardownStream();
        scheduleReconnect();
      }
    }, config.connectionTimeout);

    log("正在建立 SSE 连接...");

    let headers: Record<string, string>;
    try {
      headers = {
        ...(await buildRequestHeaders()),
        Accept: AcceptEventStream,
      };
    } catch (err) {
      logError("构造 SSE 请求头失败:", err);
      connectionState.value = SseConnectionState.DISCONNECTED;
      scheduleReconnect();
      return;
    }

    // 构头期间可能已主动断开，此时不能再发请求
    const controller = abortController;
    if (!controller || controller.signal.aborted) {
      log("构造请求头期间连接已被取消");
      connectionState.value = SseConnectionState.DISCONNECTED;
      return;
    }

    fetch(config.url, {
      method: "GET",
      headers,
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            connectionTimeoutTimer = clearTimer(connectionTimeoutTimer);
            return handleUnauthorized().then(() => null);
          }
          throw new Error(`HTTP ${response.status}`);
        }
        connectionTimeoutTimer = clearTimer(connectionTimeoutTimer);
        connectionState.value = SseConnectionState.CONNECTED;
        resetReconnectState();
        armStaleTimer();
        log("SSE 连接已建立");
        config.onOpen?.();
        return response.body?.getReader();
      })
      .then((streamReader) => {
        if (!streamReader) return;
        reader = streamReader;
        return consumeSseStream(streamReader);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") {
          log("SSE 连接已主动断开");
        } else {
          logError("SSE 连接错误:", err);
          connectionState.value = SseConnectionState.DISCONNECTED;
          scheduleReconnect();
        }
      });
  };

  /** 订阅指定事件，返回取消订阅函数（与 createStompClient 的 subscribe 同形） */
  const subscribe = <T = unknown>(eventName: string, handler: (data: T) => void): (() => void) => {
    if (!eventHandlers.has(eventName)) {
      eventHandlers.set(eventName, new Set());
    }
    const wrappedHandler: EventHandler = (data) => handler(data as T);
    eventHandlers.get(eventName)!.add(wrappedHandler);
    log(`已订阅事件: ${eventName}`);

    return () => {
      const handlers = eventHandlers.get(eventName);
      if (handlers) {
        handlers.delete(wrappedHandler);
        if (handlers.size === 0) {
          eventHandlers.delete(eventName);
        }
      }
    };
  };

  /**
   * 主动断开，不触发重连。**订阅保留**：与 createStompClient 同义——
   * 订阅随实例存活，只有 subscribe 返回的取消函数才真正移除它。
   */
  const disconnect = () => {
    isManualDisconnect = true;
    connectionTimeoutTimer = clearTimer(connectionTimeoutTimer);
    reconnectTimer = clearTimer(reconnectTimer);
    teardownStream();
    log("SSE 连接已断开");
  };

  return {
    connectionState: readonly(connectionState),
    isConnected,
    connect,
    subscribe,
    disconnect,
  };
}

/** SSE 通道实例（由 createSseChannel 产出） */
export type SseChannel = ReturnType<typeof createSseConnection>;

/**
 * 创建一条 SSE 通道
 *
 * **非单例**：每次调用新建一条连接，实例由调用方持有并负责清理
 * （通知频道由 index.ts 持有）。基于 fetch + ReadableStream。
 */
export function createSseChannel(options: UseSseOptions = {}): SseChannel {
  return createSseConnection(options);
}
