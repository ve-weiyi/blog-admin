import { defineMock } from "./base";

const baseTime = 1700000000000;

/** 站内信列表 */

const mockInbox = [
  {
    id: 1,
    message_id: 1,
    channel: "inbox",
    recipient: "00000000-0000-0000-0000-000000000001",
    template_code: "system_notice",
    content: "欢迎使用博客管理系统",
    status: "unread",
    biz_id: "",
    error_msg: "",
    read_at: 0,
    sent_at: baseTime,
    created_at: baseTime,
    title: "欢迎使用博客管理系统",
    category: "system",
  },
  {
    id: 2,
    message_id: 2,
    channel: "inbox",
    recipient: "00000000-0000-0000-0000-000000000001",
    template_code: "system_update",
    content: "系统已完成例行维护",
    status: "unread",
    biz_id: "",
    error_msg: "",
    read_at: 0,
    sent_at: baseTime + 3600000,
    created_at: baseTime + 3600000,
    title: "系统维护完成",
    category: "maintenance",
  },
  {
    id: 3,
    message_id: 3,
    channel: "inbox",
    recipient: "00000000-0000-0000-0000-000000000001",
    template_code: "system_notice",
    content: "新增功能：相册管理",
    status: "read",
    biz_id: "",
    error_msg: "",
    read_at: baseTime + 7200000,
    sent_at: baseTime + 7200000,
    created_at: baseTime + 7200000,
    title: "版本更新：相册管理",
    category: "update",
  },
];

/** 通知内容 */

const mockMessages = [
  {
    id: 1,
    title: "系统维护通知",
    content: "系统将于今晚例行维护",
    category: "maintenance",
    level: "info",
    target_type: "all",
    target_ids: "",
    status: "published",
    created_at: baseTime,
    updated_at: baseTime,
  },
  {
    id: 2,
    title: "新功能上线",
    content: "相册管理功能已上线",
    category: "update",
    level: "info",
    target_type: "all",
    target_ids: "",
    status: "draft",
    created_at: baseTime,
    updated_at: baseTime,
  },
];

/** 通知模板 */

const mockTemplates = [
  {
    id: 1,
    code: "system_notice",
    channel: "inbox",
    scene: "system",
    title: "系统通知",
    content: "您有一条新的系统通知",
    enabled: 1,
    created_at: baseTime,
    updated_at: baseTime,
  },
  {
    id: 2,
    code: "comment_reply",
    channel: "email",
    scene: "comment",
    title: "评论回复提醒",
    content: "您的评论收到了回复",
    enabled: 0,
    created_at: baseTime,
    updated_at: baseTime,
  },
];

export default defineMock([
  {
    url: "notify-messages",
    method: ["GET"],
    body: { code: 200, data: { list: mockMessages, total: mockMessages.length }, msg: "ok" },
  },
  {
    url: "notify-messages/:id",
    method: ["GET"],
    body: { code: 200, data: mockMessages[0], msg: "ok" },
  },
  {
    url: "notify-messages",
    method: ["POST"],
    body: { code: 200, data: mockMessages[0], msg: "ok" },
  },
  {
    url: "notify-messages/:id",
    method: ["PUT"],
    body: { code: 200, data: mockMessages[0], msg: "ok" },
  },
  {
    url: "notify-messages/batch-delete",
    method: ["POST"],
    body: { code: 200, data: { success_count: 1 }, msg: "ok" },
  },
  {
    url: "notify-messages/:id/publish",
    method: ["POST"],
    body: { code: 200, data: { success_count: 1 }, msg: "ok" },
  },
  {
    url: "notify-messages/:id/revoke",
    method: ["POST"],
    body: { code: 200, data: { success_count: 1 }, msg: "ok" },
  },
  {
    url: "inbox-records",
    method: ["GET"],
    body: {
      code: 200,
      data: {
        page: 1,
        page_size: 5,
        total: mockInbox.length,
        unread_total: mockInbox.filter((item) => item.status === "unread").length,
        list: mockInbox,
      },
      msg: "ok",
    },
  },
  {
    url: "inbox-records/:id/mark-read",
    method: ["POST"],
    body: { code: 200, data: { success_count: 1 }, msg: "ok" },
  },
  {
    url: "inbox-records/batch-mark-read",
    method: ["POST"],
    body: { code: 200, data: { success_count: 1 }, msg: "ok" },
  },
  {
    url: "inbox-records/mark-all-read",
    method: ["POST"],
    body: { code: 200, data: { success_count: 1 }, msg: "ok" },
  },
  {
    url: "notify-records",
    method: ["GET"],
    body: { code: 200, data: { list: mockInbox, total: mockInbox.length }, msg: "ok" },
  },
  {
    url: "notify-records/batch-delete",
    method: ["POST"],
    body: { code: 200, data: { success_count: 1 }, msg: "ok" },
  },
  {
    url: "notify-templates",
    method: ["GET"],
    body: { code: 200, data: { list: mockTemplates, total: mockTemplates.length }, msg: "ok" },
  },
  {
    url: "notify-templates/:id",
    method: ["GET"],
    body: { code: 200, data: mockTemplates[0], msg: "ok" },
  },
  {
    url: "notify-templates",
    method: ["POST"],
    body: { code: 200, data: mockTemplates[0], msg: "ok" },
  },
  {
    url: "notify-templates/:id",
    method: ["PUT"],
    body: { code: 200, data: mockTemplates[0], msg: "ok" },
  },
  {
    url: "notify-templates/batch-delete",
    method: ["POST"],
    body: { code: 200, data: { success_count: 1 }, msg: "ok" },
  },
]);
