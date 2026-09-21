import { useNotificationStoreHook } from "@/stores/notification";
import { SseEvents, type NotifyStreamFrame } from "./sseEvents";
import { createSseChannel, type SseChannel } from "./useSse";

/** 通知频道的 SSE 连接：每条业务频道一条连接，实例由本模块持有并清理 */
let notifyChannel: SseChannel | null = null;
let reconcileTimer: ReturnType<typeof setInterval> | null = null;

/**
 * 兜底对账间隔：推送是"尽力而为"的，连接健康时若某次事件丢失便不会再有信号，
 * 未读数会停在旧值——低频拉一次把它兜住。
 */
const ReconcileIntervalMs = 5 * 60 * 1000;

/**
 * 启动通知推送
 *
 * 连上流并在收到「发布 / 撤回」事件后刷新未读数；连接建立（含重连）时也刷一次，
 * 把断线期间的缺口补上——这是信号模型的自愈点。
 *
 * 幂等：重复调用只会让已存在的通道重连（connect 对连接中/已连接状态短路）。
 *
 * TODO: 未读数目前只在「我的通知」页可见；顶部入口 components/NoticeDropdown/ 是零引用死代码。
 */
export function setupSse(): void {
  if (notifyChannel) {
    notifyChannel.connect();
    return;
  }

  notifyChannel = createSseChannel({
    onOpen: () => refreshUnread(),
  });

  notifyChannel.subscribe<NotifyStreamFrame>("message", (frame) => {
    if (frame?.event === SseEvents.NOTICE || frame?.event === SseEvents.NOTICE_REVOKE) {
      refreshUnread();
    }
  });

  notifyChannel.connect();

  // 兜底对账：低频拉一次
  reconcileTimer = setInterval(() => refreshUnread(), ReconcileIntervalMs);
}

/** 刷新未读数。推送只是提醒，具体数字以接口为准 */
function refreshUnread(): void {
  void useNotificationStoreHook().refreshUnread();
}

/** 清理推送连接与兜底对账（登出时调用） */
export function cleanupSseServices(): void {
  notifyChannel?.disconnect();
  notifyChannel = null;

  if (reconcileTimer) {
    clearInterval(reconcileTimer);
    reconcileTimer = null;
  }
}

export { createSseChannel, SseConnectionState } from "./useSse";
export type { SseChannel, UseSseOptions } from "./useSse";
export { SseEvents } from "./sseEvents";
export type { SseEventType, NotifyStreamFrame } from "./sseEvents";
