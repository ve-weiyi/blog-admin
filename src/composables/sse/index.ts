import { useDictSync } from "./useDictSync";
import { useOnlineCount } from "./useOnlineCount";
import { useSse, cleanupSse } from "./useSse";

/**
 * 初始化所有 SSE 服务
 */
export function setupSse() {
  const sse = useSse();
  sse.connect();

  const dictSync = useDictSync();
  dictSync.initialize();

  const onlineCount = useOnlineCount();
  onlineCount.initialize();
}

/**
 * 清理所有 SSE 连接
 */
export function cleanupSseServices() {
  const dictSync = useDictSync();
  dictSync.cleanup();

  const onlineCount = useOnlineCount();
  onlineCount.cleanup();

  cleanupSse();
}

export { useDictSync } from "./useDictSync";
export { useOnlineCount } from "./useOnlineCount";
export { useSse, cleanupSse, SseConnectionState } from "./useSse";
export { SseTopics } from "./sseTopics";
export type { DictChangeMessage, DictChangeCallback } from "./useDictSync";
export type { SseTopic } from "./sseTopics";
