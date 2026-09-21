/**
 * 推送事件类型
 *
 * @description
 * 后端推送流只写 `data:` 行、不带 `event:` 字段，所以事件类型放在载荷的
 * `event` 字段里，客户端订默认的 `message` 事件后按该字段分发。
 * 取值与后端 `blog-cloud/infra/notifyx` 的事件常量一一对应。
 */
export const SseEvents = {
  /** 通知消息已发布 */
  NOTICE: "notice",
  /** 通知消息已撤回 */
  NOTICE_REVOKE: "notice-revoke",
} as const;

export type SseEventType = (typeof SseEvents)[keyof typeof SseEvents];

/**
 * 推送帧的载荷形状
 *
 * 字段变更需**同步三处**：本文件、`protocol/api/admin/notification.api` 的
 * NotifyStreamEvent、`infra/notifyx/event.go`。
 */
export interface NotifyStreamFrame {
  event?: SseEventType;
  message_id?: number;
  title?: string;
  category?: string;
  level?: string;
}
