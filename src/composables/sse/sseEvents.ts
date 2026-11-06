/**
 * 推送事件类型
 *
 * @description
 * 后端推送流只写 `data:` 行、不带 `event:` 字段，所以事件类型放在载荷的
 * `event` 字段里，客户端订默认的 `message` 事件后按该字段分发。
 * 取值与后端 `blog-cloud/infra/messaging/notifyx` 的事件常量一一对应。
 */
export const SseEvents = {
  /** 公告已发布 */
  ANNOUNCEMENT_PUBLISHED: "announcement-published",
  /** 公告已撤回 */
  ANNOUNCEMENT_REVOKED: "announcement-revoked",
} as const;

export type SseEventType = (typeof SseEvents)[keyof typeof SseEvents];

/**
 * 推送帧的载荷形状
 *
 * 字段变更需同步全部订阅端：本文件、`protocol/api/admin/notification.api` 的
 * AnnouncementStreamEvent、`infra/messaging/notifyx/event.go`。
 */
export interface NotifyStreamFrame {
  event?: SseEventType;
  announcement_id?: number;
  title?: string;
  category?: string;
  level?: string;
  published_at?: number;
}
