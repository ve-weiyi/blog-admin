import { defineMock } from "./base";

const MOCK_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23409eff'/%3E%3Ctext x='20' y='27' font-size='20' font-family='sans-serif' text-anchor='middle' fill='%23fff'%3EA%3C/text%3E%3C/svg%3E";

const MOCK_CAPTCHA_CODE = "1234";

const baseTime = 1700000000000;

const mockCaptchaImage = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40">
     <rect width="120" height="40" fill="#f2f3f5"/>
     <text x="60" y="27" font-size="20" font-family="monospace" text-anchor="middle" fill="#303133">${MOCK_CAPTCHA_CODE}</text>
   </svg>`
)}`;

/** 模拟令牌，字段与后端 Token 结构一致 */

const mockGuestInfo = {
  device_id: "mock-device-id",
  os: "macOS",
  browser: "Chrome",
  ip_address: "127.0.0.1",
  ip_source: "本机",
};

/** 模拟游客 */

const mockGuests = [
  {
    id: 1,
    device_id: "mock-device-id",
    os: "macOS",
    browser: "Chrome",
    ip_address: "127.0.0.1",
    ip_source: "本机",
    created_at: baseTime,
    updated_at: baseTime,
  },
  {
    id: 2,
    device_id: "mock-device-id-2",
    os: "Windows 11",
    browser: "Edge",
    ip_address: "192.168.1.10",
    ip_source: "内网",
    created_at: baseTime,
    updated_at: baseTime,
  },
];

/** 模拟在线用户 */

const mockProfile = {
  user_id: "00000000-0000-0000-0000-000000000001",
  username: "admin",
  nickname: "管理员",
  avatar: MOCK_AVATAR,
  email: "admin@example.com",
  mobile: "13800000000",
  status: 1,
  created_at: 1700000000000,
  updated_at: 1700000000000,
  third_party: [],
  roles: ["ROOT"],
  perms: ["*:*:*"],
  gender: 1,
  intro: "",
  website: "",
};

/** 模拟当前登录用户角色 */

const mockLoginLogs = [
  {
    id: 1,
    user_id: mockProfile.user_id,
    device_id: "mock-device",
    login_type: "password",
    status: 1,
    fail_reason: "",
    login_at: 1700000000000,
    logout_at: 1700003600000,
    user_info: {},
    guest_info: {},
  },
];

const mockToken = {
  token_type: "Bearer",
  access_token: "mock-access-token",
  expires_in: 3600,
  refresh_token: "mock-refresh-token",
  refresh_expires_in: 604800,
  refresh_expires_at: Math.floor(Date.now() / 1000) + 604800,
};

/** 模拟登录响应 */

const mockLoginResp = {
  user_id: "00000000-0000-0000-0000-000000000001",
  user_type: "admin",
  scope: "admin",
  token: mockToken,
};

const mockUserInfo = {
  user_id: "00000000-0000-0000-0000-000000000001",
  username: "admin",
  avatar: MOCK_AVATAR,
  nickname: "管理员",
  user_type: "admin",
};

const mockOnlineUsers = [
  { user_info: mockUserInfo, guest_info: mockGuestInfo, last_active_at: baseTime },
];

const mockRole = {
  id: 1,
  parent_id: 0,
  role_key: "ROOT",
  role_label: "超级管理员",
  role_comment: "拥有全部权限",
};

/** 模拟登录日志 */

const mockUsers = [
  {
    id: 1,
    user_id: "00000000-0000-0000-0000-000000000001",
    username: "admin",
    nickname: "管理员",
    avatar: MOCK_AVATAR,
    mobile: "13800000000",
    email: "admin@example.com",
    status: 1,
    register_type: "email",
    ip_address: "127.0.0.1",
    ip_source: "本机",
    created_at: baseTime,
    updated_at: baseTime,
    roles: [{ role_id: 1, role_key: "ROOT", role_label: "超级管理员" }],
  },
  {
    id: 2,
    user_id: "00000000-0000-0000-0000-000000000002",
    username: "editor",
    nickname: "内容编辑",
    avatar: MOCK_AVATAR,
    mobile: "13900000000",
    email: "editor@example.com",
    status: 1,
    register_type: "email",
    ip_address: "127.0.0.1",
    ip_source: "本机",
    created_at: baseTime,
    updated_at: baseTime,
    roles: [{ role_id: 2, role_key: "EDITOR", role_label: "内容编辑" }],
  },
];

/** 模拟角色 */

const ok = (data: unknown) => ({ code: "SUCCESS", data, message: "ok" });

export default defineMock([
  {
    url: "auth/captchas",
    method: ["GET"],
    body: {
      code: "SUCCESS",
      data: {
        captcha_key: "mock-captcha-key",
        captcha_base64: mockCaptchaImage,
        captcha_code: MOCK_CAPTCHA_CODE,
      },
      message: "ok",
    },
  },
  {
    url: "auth/login-by-password",
    method: ["POST"],
    body: { code: "SUCCESS", data: mockLoginResp, message: "ok" },
  },
  {
    url: "auth/refresh-token",
    method: ["POST"],
    body: { code: "SUCCESS", data: mockLoginResp, message: "ok" },
  },
  {
    url: "auth/session",
    method: ["DELETE"],
    body: { code: "SUCCESS", data: {}, message: "ok" },
  },
  {
    url: "auth/login-by-email",
    method: ["POST"],
    body: { code: "SUCCESS", data: mockLoginResp, message: "ok" },
  },
  {
    url: "auth/login-by-mobile",
    method: ["POST"],
    body: { code: "SUCCESS", data: mockLoginResp, message: "ok" },
  },
  {
    // 第三方登录按平台建模为子资源
    url: "auth/oauth/:platform/authorize",
    method: ["GET"],
    body: { code: "SUCCESS", data: { authorize_url: "https://example.com/oauth/authorize" }, message: "ok" },
  },
  {
    url: "auth/oauth/:platform/login",
    method: ["POST"],
    body: { code: "SUCCESS", data: mockLoginResp, message: "ok" },
  },
  { url: "auth/register", method: ["POST"], body: { code: "SUCCESS", data: {}, message: "ok" } },
  { url: "auth/password-resets", method: ["POST"], body: { code: "SUCCESS", data: {}, message: "ok" } },
  {
    url: "auth/email-verification-codes",
    method: ["POST"],
    body: { code: "SUCCESS", data: {}, message: "ok" },
  },
  {
    url: "auth/mobile-verification-codes",
    method: ["POST"],
    body: { code: "SUCCESS", data: {}, message: "ok" },
  },
  {
    url: "guests/current",
    method: ["GET"],
    body: {
      code: "SUCCESS",
      data: { id: 1, device_id: "mock-device-id" },
      message: "ok",
    },
  },
  {
    url: "guests",
    method: ["GET"],
    body: ok({ list: mockGuests, total: mockGuests.length }),
  },
  {
    url: "me/profile",
    method: ["GET"],
    body: { code: "SUCCESS", data: mockProfile, message: "ok" },
  },
  {
    url: "me/apis",
    method: ["GET"],
    body: { code: "SUCCESS", data: { list: [] }, message: "ok" },
  },
  {
    // 返回空列表，触发开发者模式下的本地静态路由
    url: "me/menus",
    method: ["GET"],
    body: { code: "SUCCESS", data: { list: [] }, message: "ok" },
  },
  {
    url: "me/roles",
    method: ["GET"],
    body: { code: "SUCCESS", data: { list: [mockRole] }, message: "ok" },
  },
  {
    url: "me/login-logs",
    method: ["GET"],
    body: ok({ list: mockLoginLogs, total: mockLoginLogs.length }),
  },
  { url: "me/profile", method: ["PUT"], body: ok({}) },
  { url: "me/avatar", method: ["PUT"], body: ok({}) },
  { url: "me/password", method: ["PUT"], body: ok({}) },
  { url: "me/bind-email", method: ["POST"], body: ok({}) },
  { url: "me/bind-mobile", method: ["POST"], body: ok({}) },
  { url: "me/bind-third-party", method: ["POST"], body: ok({}) },
  { url: "me/unbind-third-party", method: ["POST"], body: ok({}) },
  {
    url: "users",
    method: ["GET"],
    body: ok({ list: mockUsers, total: mockUsers.length }),
  },
  {
    url: "users/online",
    method: ["GET"],
    body: ok({ list: mockOnlineUsers }),
  },
  { url: "users/:user_id/reset-password", method: ["POST"], body: ok({ success: true }) },
  { url: "users/:user_id/roles", method: ["PUT"], body: ok({ success: true }) },
  { url: "users/:user_id", method: ["PATCH"], body: ok({ success: true }) },
]);
