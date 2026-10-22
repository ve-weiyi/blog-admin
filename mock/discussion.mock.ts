import { defineMock } from "./base";

const MOCK_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23409eff'/%3E%3Ctext x='20' y='27' font-size='20' font-family='sans-serif' text-anchor='middle' fill='%23fff'%3EA%3C/text%3E%3C/svg%3E";

const baseTime = 1700000000000;

const ok = (data: unknown) => ({ code: "SUCCESS", data, message: "ok" });

const batch = (n = 1) => ok({ success_count: n });

const mockUserInfo = {
  user_id: "00000000-0000-0000-0000-000000000001",
  username: "admin",
  avatar: MOCK_AVATAR,
  nickname: "管理员",
  user_type: "admin",
};

/** 友链 */

const mockGuestInfo = {
  device_id: "mock-device-id",
  os: "macOS",
  browser: "Chrome",
  ip_address: "127.0.0.1",
  ip_source: "本机",
};

const mockComments = [
  {
    id: 1,
    user_id: mockUserInfo.user_id,
    device_id: mockGuestInfo.device_id,
    type: 1,
    topic_title: "Vue3 组合式 API 实践",
    reply_user_id: "",
    comment_content: "这是一条模拟评论内容",
    status: 0,
    created_at: baseTime,
    guest_info: mockGuestInfo,
    user_info: mockUserInfo,
    reply_user_info: mockUserInfo,
  },
  {
    id: 2,
    user_id: mockUserInfo.user_id,
    device_id: mockGuestInfo.device_id,
    type: 1,
    topic_title: "Vue3 组合式 API 实践",
    reply_user_id: mockUserInfo.user_id,
    comment_content: "这是一条模拟回复内容",
    status: 1,
    created_at: baseTime + 3600000,
    guest_info: mockGuestInfo,
    user_info: mockUserInfo,
    reply_user_info: mockUserInfo,
  },
  {
    id: 3,
    user_id: mockUserInfo.user_id,
    device_id: mockGuestInfo.device_id,
    type: 3,
    topic_title: "说说：今天天气不错",
    reply_user_id: "",
    comment_content: "模拟说说评论内容",
    status: 1,
    created_at: baseTime + 7200000,
    guest_info: mockGuestInfo,
    user_info: mockUserInfo,
    reply_user_info: mockUserInfo,
  },
];

/** 模拟留言列表 */

const mockMessages = [
  {
    id: 1,
    user_id: mockUserInfo.user_id,
    device_id: mockGuestInfo.device_id,
    message_content: "这是一条模拟留言内容",
    status: 1,
    created_at: baseTime,
    updated_at: baseTime,
    user_info: mockUserInfo,
    guest_info: mockGuestInfo,
  },
  {
    id: 2,
    user_id: mockUserInfo.user_id,
    device_id: mockGuestInfo.device_id,
    message_content: "这是另一条模拟留言内容",
    status: 0,
    created_at: baseTime + 3600000,
    updated_at: baseTime + 3600000,
    user_info: mockUserInfo,
    guest_info: mockGuestInfo,
  },
];

const mockTalks = [
  {
    id: 1,
    user_id: mockUserInfo.user_id,
    content: "今天天气不错",
    img_list: [],
    is_top: 0,
    status: 1,
    like_count: 3,
    comment_count: 1,
    created_at: baseTime,
    updated_at: baseTime,
    user_info: mockUserInfo,
  },
  {
    id: 2,
    user_id: mockUserInfo.user_id,
    content: "记录一下",
    img_list: [],
    is_top: 1,
    status: 1,
    like_count: 0,
    comment_count: 0,
    created_at: baseTime,
    updated_at: baseTime,
    user_info: mockUserInfo,
  },
];

export default defineMock([
  {
    url: "comments",
    method: ["GET"],
    body: {
      code: "SUCCESS",
      data: { list: mockComments, total: mockComments.length },
      message: "ok",
    },
  },
  {
    url: "comments/batch-delete",
    method: ["POST"],
    body: { code: "SUCCESS", data: { success_count: 1 }, message: "ok" },
  },
  {
    url: "comments",
    method: ["PATCH"],
    body: { code: "SUCCESS", data: { success_count: 1 }, message: "ok" },
  },
  {
    url: "messages",
    method: ["GET"],
    body: {
      code: "SUCCESS",
      data: { list: mockMessages, total: mockMessages.length },
      message: "ok",
    },
  },
  {
    url: "messages/batch-delete",
    method: ["POST"],
    body: { code: "SUCCESS", data: { success_count: 1 }, message: "ok" },
  },
  {
    url: "messages",
    method: ["PATCH"],
    body: { code: "SUCCESS", data: { success_count: 1 }, message: "ok" },
  },
  {
    url: "talks",
    method: ["GET"],
    body: ok({ list: mockTalks, total: mockTalks.length }),
  },
  { url: "talks", method: ["POST"], body: ok(mockTalks[0]) },
  { url: "talks/:id", method: ["PUT"], body: ok(mockTalks[0]) },
  { url: "talks/batch-delete", method: ["POST"], body: batch() },
]);
