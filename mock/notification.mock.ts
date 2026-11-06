import { defineMock } from "./base";
import type {
  AnnouncementVO,
  DeliveryVO,
  NotificationEventVO,
  NotificationGroupVO,
  NotificationItemVO,
} from "@/api/types";

const now = Date.now();

let announcementSeq = 2;
let announcements: AnnouncementVO[] = [
  {
    id: 1,
    title: "系统维护通知",
    content: "系统将于今晚 23:00 例行维护，预计持续 30 分钟。",
    category: "maintenance",
    level: "warning",
    target_type: "all",
    target_ids: "",
    status: "published",
    published_at: now - 3600000,
    published_by: "mock-admin",
    created_at: now - 7200000,
    updated_at: now - 3600000,
  },
  {
    id: 2,
    title: "相册管理功能上线",
    content: "相册与照片支持批量管理、软删除与恢复。",
    category: "update",
    level: "info",
    target_type: "all",
    target_ids: "",
    status: "draft",
    published_at: 0,
    published_by: "",
    created_at: now - 1800000,
    updated_at: now - 1800000,
  },
];

let events: NotificationEventVO[] = [
  {
    id: 1,
    scene: "announcement",
    actor_id: "",
    object_type: "announcement",
    object_id: 1,
    audience_type: "all",
    audience_total: 128,
    processed: 128,
    status: "done",
    cursor: 128,
    created_at: now - 3600000,
    updated_at: now - 3500000,
  },
  {
    id: 2,
    scene: "content.commented",
    actor_id: "00000000-0000-0000-0000-000000000002",
    object_type: "article",
    object_id: 3,
    audience_type: "user_ids",
    audience_total: 1,
    processed: 0,
    status: "fanning",
    cursor: 0,
    created_at: now - 600000,
    updated_at: now - 300000,
  },
  {
    id: 3,
    scene: "article.liked",
    actor_id: "00000000-0000-0000-0000-000000000003",
    object_type: "article",
    object_id: 7,
    audience_type: "user_ids",
    audience_total: 1,
    processed: 0,
    status: "failed",
    cursor: 0,
    created_at: now - 86400000,
    updated_at: now - 86000000,
  },
];

let deliveries: DeliveryVO[] = [
  {
    id: 1,
    notification_id: 11,
    channel: "email",
    recipient: "reader@example.com",
    status: "sent",
    template_code: "content.reviewed",
    content: "你的评论已通过审核。",
    provider_msg_id: "mock-smtp-1",
    error_msg: "",
    attempts: 1,
    next_retry_at: 0,
    sent_at: now - 3600000,
    created_at: now - 3700000,
    updated_at: now - 3600000,
  },
  {
    id: 2,
    notification_id: 12,
    channel: "email",
    recipient: "bounced@example.com",
    status: "failed",
    template_code: "content.reviewed",
    content: "你的评论未通过审核。",
    provider_msg_id: "",
    error_msg: "smtp: mailbox unavailable",
    attempts: 3,
    next_retry_at: now + 600000,
    sent_at: 0,
    created_at: now - 7200000,
    updated_at: now - 1800000,
  },
  {
    id: 3,
    notification_id: 13,
    channel: "sms",
    recipient: "13800000000",
    status: "pending",
    template_code: "account.security",
    content: "你的账号邮箱已变更。",
    provider_msg_id: "",
    error_msg: "",
    attempts: 0,
    next_retry_at: now,
    sent_at: 0,
    created_at: now - 600000,
    updated_at: now - 600000,
  },
];

let groups: NotificationGroupVO[] = [
  {
    group_key: "admin-announcement-maintenance",
    scene: "announcement",
    title: "系统维护通知",
    content: "系统将于今晚 23:00 例行维护，预计持续 30 分钟。",
    link: "/notification/notice",
    level: "warning",
    actor_count: 1,
    latest_actor_name: "",
    latest_at: now - 600000,
    unread: true,
  },
  {
    group_key: "admin-announcement-published",
    scene: "announcement",
    title: "公告发布成功",
    content: "《相册管理功能上线》已发布给全部用户。",
    link: "/notification/notice",
    level: "success",
    actor_count: 1,
    latest_actor_name: "",
    latest_at: now - 1800000,
    unread: true,
  },
  {
    group_key: "admin-security-login",
    scene: "account.security",
    title: "新设备登录提醒",
    content: "你的账号刚刚在 macOS · Chrome 上登录，如非本人操作请及时修改密码。",
    link: "",
    level: "warning",
    actor_count: 1,
    latest_actor_name: "",
    latest_at: now - 3600000,
    unread: true,
  },
  {
    group_key: "admin-security-password",
    scene: "account.security",
    title: "管理员密码已修改",
    content: "账号密码已于今天 09:30 修改。",
    link: "",
    level: "success",
    actor_count: 1,
    latest_actor_name: "",
    latest_at: now - 7200000,
    unread: false,
  },
  {
    group_key: "admin-comment-1",
    scene: "content.commented",
    title: "文章收到新评论",
    content: "Vue3 组合式 API 实践",
    link: "/article/1",
    level: "info",
    actor_count: 2,
    latest_actor_name: "小明",
    latest_at: now - 10800000,
    unread: false,
  },
  {
    group_key: "admin-review-1",
    scene: "content.reviewed",
    title: "评论审核结果",
    content: "你的评论已通过审核。",
    link: "",
    level: "info",
    actor_count: 1,
    latest_actor_name: "",
    latest_at: now - 14400000,
    unread: false,
  },
  {
    group_key: "admin-like-1",
    scene: "article.liked",
    title: "文章收到赞",
    content: "Go 并发模式",
    link: "/article/2",
    level: "info",
    actor_count: 5,
    latest_actor_name: "小红",
    latest_at: now - 86400000,
    unread: false,
  },
  {
    group_key: "admin-announcement-revoked",
    scene: "announcement",
    title: "公告已撤回",
    content: "《旧版维护通知》已撤回，用户收件箱中的对应条目同步清理。",
    link: "/notification/notice",
    level: "info",
    actor_count: 1,
    latest_actor_name: "",
    latest_at: now - 172800000,
    unread: false,
  },
];

const items: NotificationItemVO[] = [
  {
    id: 1,
    event_id: 2,
    scene: "content.commented",
    actor_id: "00000000-0000-0000-0000-000000000002",
    actor_name: "小明",
    object_type: "article",
    object_id: 1,
    title: "有人评论了你的文章",
    content: "Vue3 组合式 API 实践",
    link: "/article/1",
    read_at: 0,
    created_at: now - 600000,
  },
  {
    id: 2,
    event_id: 3,
    scene: "article.liked",
    actor_id: "00000000-0000-0000-0000-000000000003",
    actor_name: "小红",
    object_type: "article",
    object_id: 2,
    title: "你的文章收到了赞",
    content: "Go 并发模式",
    link: "/article/2",
    read_at: now - 3600000,
    created_at: now - 1800000,
  },
];

const sceneGroup: Record<string, string> = {
  announcement: "announcement",
  "content.commented": "comment",
  "comment.replied": "comment",
  "comment.liked": "like",
  "article.liked": "like",
  "talk.liked": "like",
  "content.reviewed": "review",
  "account.security": "security",
};

function ok(data: unknown) {
  return { code: "SUCCESS", data, message: "ok" };
}

function fail(code: string, message: string) {
  return { code, data: {}, message };
}

function str(value: unknown): string {
  return value == null ? "" : String(value);
}

function num(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function pageOf<T>(list: T[], query: Record<string, unknown>) {
  const page = Math.max(1, num(query.page, 1));
  const pageSize = Math.max(1, num(query.page_size, 10));
  const start = (page - 1) * pageSize;
  return {
    page,
    page_size: pageSize,
    total: list.length,
    list: list.slice(start, start + pageSize),
  };
}

function queryGroups(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  return str(value).split(",").filter(Boolean);
}

function groupOfScene(scene: string): string {
  return sceneGroup[scene] ?? "comment";
}

function unreadGroupCounts(list: NotificationGroupVO[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of list) {
    if (!item.unread) {
      continue;
    }
    const group = groupOfScene(item.scene);
    counts[group] = (counts[group] ?? 0) + 1;
  }
  return counts;
}

export default defineMock([
  // ==================== 公告 ====================
  {
    url: "announcements",
    method: ["GET"],
    body: (req) => {
      const query = req.query;
      const list = announcements.filter(
        (item) =>
          (!str(query.category) || item.category === str(query.category)) &&
          (!str(query.level) || item.level === str(query.level)) &&
          (!str(query.status) || item.status === str(query.status)) &&
          (!str(query.target_type) || item.target_type === str(query.target_type))
      );
      return ok(pageOf(list, query));
    },
  },
  {
    url: "announcements",
    method: ["POST"],
    body: (req) => {
      const input = req.body as Partial<AnnouncementVO>;
      const item: AnnouncementVO = {
        id: ++announcementSeq,
        title: input.title ?? "未命名公告",
        content: input.content ?? "",
        category: input.category ?? "system",
        level: input.level ?? "info",
        target_type: input.target_type ?? "all",
        target_ids: input.target_ids ?? "",
        status: "draft",
        published_at: 0,
        published_by: "",
        created_at: Date.now(),
        updated_at: Date.now(),
      };
      announcements.unshift(item);
      return ok(item);
    },
  },
  {
    url: "announcements/batch-delete",
    method: ["POST"],
    body: (req) => {
      const ids = (req.body.ids ?? []).map(Number);
      announcements = announcements.filter((item) => !ids.includes(item.id ?? 0));
      return ok({ success_count: ids.length });
    },
  },
  // 管理端公告状态流（SSE）：只发送心跳，保持连接不重连
  {
    url: "announcements/stream",
    method: ["GET"],
    response(_req, res) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      });
      res.write(": ping\n\n");
      const timer = setInterval(() => res.write(": ping\n\n"), 15000);
      res.on("close", () => clearInterval(timer));
    },
  },

  {
    url: "announcements/:id",
    method: ["GET"],
    body: (req) => {
      const item = announcements.find((row) => row.id === Number(req.params.id));
      return item ? ok(item) : fail("RESOURCE_NOT_FOUND", "公告不存在");
    },
  },
  {
    url: "announcements/:id",
    method: ["PUT"],
    body: (req) => {
      const item = announcements.find((row) => row.id === Number(req.params.id));
      if (!item) {
        return fail("RESOURCE_NOT_FOUND", "公告不存在");
      }
      Object.assign(item, req.body, { id: item.id, updated_at: Date.now() });
      return ok(item);
    },
  },
  {
    url: "announcements/:id/publish",
    method: ["POST"],
    body: (req) => {
      const item = announcements.find((row) => row.id === Number(req.params.id));
      if (!item) {
        return fail("RESOURCE_NOT_FOUND", "公告不存在");
      }
      item.status = "published";
      item.published_at = Date.now();
      item.published_by = "mock-admin";
      item.updated_at = Date.now();
      return ok(item);
    },
  },
  {
    url: "announcements/:id/revoke",
    method: ["POST"],
    body: (req) => {
      const item = announcements.find((row) => row.id === Number(req.params.id));
      if (!item) {
        return fail("RESOURCE_NOT_FOUND", "公告不存在");
      }
      item.status = "revoked";
      item.updated_at = Date.now();
      return ok(item);
    },
  },
  // ==================== 事件 ====================
  {
    url: "notification-events",
    method: ["GET"],
    body: (req) => {
      const query = req.query;
      const list = events.filter(
        (item) =>
          (!str(query.status) || item.status === str(query.status)) &&
          (!str(query.scene) || item.scene === str(query.scene))
      );
      return ok(pageOf(list, query));
    },
  },
  {
    url: "notification-events/stalled",
    method: ["GET"],
    body: (req) => {
      const limit = Math.max(1, num(req.query.limit, 100));
      const list = events
        .filter((item) => item.status === "fanning" || item.status === "failed")
        .sort((a, b) => a.updated_at - b.updated_at)
        .slice(0, limit);
      return ok({ page: 1, page_size: list.length, total: list.length, list });
    },
  },
  {
    url: "notification-events/:id/redeliver",
    method: ["POST"],
    body: (req) => {
      const item = events.find((row) => row.id === Number(req.params.id));
      if (!item) {
        return fail("RESOURCE_NOT_FOUND", "事件不存在");
      }
      item.status = "pending";
      item.processed = 0;
      item.cursor = 0;
      item.updated_at = Date.now();
      return ok({});
    },
  },

  // ==================== 投递记录 ====================
  {
    url: "notification-deliveries",
    method: ["GET"],
    body: (req) => {
      const query = req.query;
      const list = deliveries.filter(
        (item) =>
          (!str(query.channel) || item.channel === str(query.channel)) &&
          (!str(query.status) || item.status === str(query.status)) &&
          (!str(query.recipient) || item.recipient.includes(str(query.recipient))) &&
          (!query.notification_id || item.notification_id === Number(query.notification_id))
      );
      return ok(pageOf(list, query));
    },
  },
  {
    url: "notification-deliveries/batch-delete",
    method: ["POST"],
    body: (req) => {
      const ids = (req.body.ids ?? []).map(Number);
      deliveries = deliveries.filter((item) => !ids.includes(item.id ?? 0));
      return ok({ success_count: ids.length });
    },
  },
  {
    url: "notification-deliveries/:id/redeliver",
    method: ["POST"],
    body: (req) => {
      const item = deliveries.find((row) => row.id === Number(req.params.id));
      if (!item) {
        return fail("RESOURCE_NOT_FOUND", "投递记录不存在");
      }
      item.status = "pending";
      item.attempts = 0;
      item.error_msg = "";
      item.next_retry_at = Date.now();
      item.updated_at = Date.now();
      return ok({});
    },
  },

  // ==================== 我的通知 ====================
  {
    url: "me/notifications",
    method: ["GET"],
    body: (req) => {
      const query = req.query;
      const groupsFilter = queryGroups(query.groups);
      const unreadOnly = query.unread_only === true || str(query.unread_only) === "true";
      const list = groups.filter(
        (item) =>
          (!groupsFilter.length || groupsFilter.includes(groupOfScene(item.scene))) &&
          (!unreadOnly || item.unread)
      );
      return ok(pageOf(list, query));
    },
  },
  {
    url: "me/notifications/unread-count",
    method: ["GET"],
    body: () =>
      ok({
        total: groups.filter((item) => item.unread).length,
        group_counts: unreadGroupCounts(groups),
      }),
  },
  {
    url: "me/notifications/read",
    method: ["POST"],
    body: (req) => {
      const item = groups.find((row) => row.group_key === str(req.body.group_key));
      if (!item) {
        return ok({ success_count: 0 });
      }
      item.unread = false;
      return ok({ success_count: 1 });
    },
  },
  {
    url: "me/notifications/read-all",
    method: ["POST"],
    body: () => {
      const count = groups.filter((item) => item.unread).length;
      for (const item of groups) {
        item.unread = false;
      }
      return ok({ success_count: count });
    },
  },
  {
    url: "me/notifications/delete",
    method: ["POST"],
    body: (req) => {
      const before = groups.length;
      groups = groups.filter((item) => item.group_key !== str(req.body.group_key));
      return ok({ success_count: before - groups.length });
    },
  },
  {
    url: "users/:user_id/notifications",
    method: ["GET"],
    body: (req) => ok(pageOf(items, req.query)),
  },
]);
