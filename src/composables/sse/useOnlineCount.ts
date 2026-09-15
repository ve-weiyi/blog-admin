import { ref, readonly } from "vue";
import { useSse } from "./useSse";
import { SseTopics } from "./sseTopics";

let globalInstance: ReturnType<typeof createOnlineCountComposable> | null = null;

function createOnlineCountComposable() {
  const onlineUserCount = ref(0);
  const lastUpdateTime = ref(0);

  const sse = useSse();

  let unsubscribe: (() => void) | null = null;

  /** 处理在线用户数变更消息 */
  const handleOnlineUsersMessage = (count: number) => {
    if (!Number.isFinite(count) || count < 0) return;
    onlineUserCount.value = count;
    lastUpdateTime.value = Date.now();
  };

  /** 订阅 SSE 在线用户数事件 */
  const initialize = () => {
    unsubscribe = sse.on(SseTopics.ONLINE_USERS, handleOnlineUsersMessage);
  };

  /** 取消 SSE 订阅并重置计数 */
  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
    onlineUserCount.value = 0;
    lastUpdateTime.value = 0;
  };

  return {
    onlineUserCount: readonly(onlineUserCount),
    lastUpdateTime: readonly(lastUpdateTime),
    isConnected: sse.isConnected,
    connectionState: sse.connectionState,
    initialize,
    cleanup,
  };
}

/** 在线用户数组合式函数（单例模式） */
export function useOnlineCount() {
  if (!globalInstance) {
    globalInstance = createOnlineCountComposable();
  }
  return globalInstance;
}
