import { useOnlineCount } from "./useOnlineCount";
import { useSse, cleanupSse } from "./useSse";

/**
 * 初始化所有 SSE 服务
 */
export function setupSse() {
  const sse = useSse();
  sse.connect();

  const onlineCount = useOnlineCount();
  onlineCount.initialize();
}

/**
 * 清理所有 SSE 连接
 */
export function cleanupSseServices() {
  const onlineCount = useOnlineCount();
  onlineCount.cleanup();

  cleanupSse();
}

export { useOnlineCount } from "./useOnlineCount";
export { useSse, cleanupSse, SseConnectionState } from "./useSse";
export { SseTopics } from "./sseTopics";
export type { SseTopic } from "./sseTopics";
