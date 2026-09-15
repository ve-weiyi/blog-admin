import { defineMock } from "./base";

const MOCK_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23409eff'/%3E%3Ctext x='20' y='27' font-size='20' font-family='sans-serif' text-anchor='middle' fill='%23fff'%3EA%3C/text%3E%3C/svg%3E";

const baseTime = 1700000000000;

const ok = (data: unknown) => ({ code: 200, data, msg: "ok" });

const batch = (n = 1) => ok({ success_count: n });

const mockGuestInfo = {
  device_id: "mock-device-id",
  os: "macOS",
  browser: "Chrome",
  ip_address: "127.0.0.1",
  ip_source: "本机",
};

/** 登录日志 */

const mockUserInfo = {
  user_id: "00000000-0000-0000-0000-000000000001",
  username: "admin",
  avatar: MOCK_AVATAR,
  nickname: "管理员",
  user_type: "admin",
};

const mockLoginLogs = [
  {
    id: 1,
    user_id: mockUserInfo.user_id,
    device_id: mockGuestInfo.device_id,
    login_type: "password",
    login_at: baseTime,
    logout_at: baseTime + 3600000,
    user_info: mockUserInfo,
    guest_info: mockGuestInfo,
  },
];

/** 操作日志 */

const mockOperationLogs = [
  {
    id: 1,
    user_id: mockUserInfo.user_id,
    device_id: mockGuestInfo.device_id,
    module: "文章管理",
    description: "新增文章",
    request_uri: "/admin-api/v1/article/create_article",
    request_method: "POST",
    request_data: "{}",
    response_data: "{}",
    response_status: 200,
    cost: "12ms",
    created_at: baseTime,
    updated_at: baseTime,
    user_info: mockUserInfo,
    guest_info: mockGuestInfo,
  },
];

/** 上传日志 */

const mockUploadLogs = [
  {
    id: 1,
    user_id: mockUserInfo.user_id,
    device_id: mockGuestInfo.device_id,
    file_base: "blog/article/",
    file_name: "cover.png",
    file_type: "image/png",
    file_size: 204800,
    file_md5: "d41d8cd98f00b204e9800998ecf8427e",
    file_url: "https://example.com/cover.png",
    created_at: baseTime,
    updated_at: baseTime,
    user_info: mockUserInfo,
    guest_info: mockGuestInfo,
  },
];

/** 访问日志 */

const mockVisitLogs = [
  {
    id: 1,
    user_id: mockUserInfo.user_id,
    device_id: mockGuestInfo.device_id,
    page_name: "首页",
    created_at: baseTime,
    updated_at: baseTime,
    user_info: mockUserInfo,
    guest_info: mockGuestInfo,
  },
];

export default defineMock([
  {
    url: "login-logs",
    method: ["GET"],
    body: ok({ list: mockLoginLogs, total: mockLoginLogs.length }),
  },
  { url: "login-logs/batch-delete", method: ["POST"], body: batch() },
  {
    url: "operation-logs",
    method: ["GET"],
    body: ok({ list: mockOperationLogs, total: mockOperationLogs.length }),
  },
  { url: "operation-logs/batch-delete", method: ["POST"], body: batch() },
  {
    url: "upload-logs",
    method: ["GET"],
    body: ok({ list: mockUploadLogs, total: mockUploadLogs.length }),
  },
  { url: "upload-logs/batch-delete", method: ["POST"], body: batch() },
  {
    url: "visit-logs",
    method: ["GET"],
    body: ok({ list: mockVisitLogs, total: mockVisitLogs.length }),
  },
  { url: "visit-logs/batch-delete", method: ["POST"], body: batch() },
]);
