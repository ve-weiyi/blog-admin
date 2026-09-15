import { defineMock } from "./base";

const baseTime = 1700000000000;

const ok = (data: unknown) => ({ code: 200, data, msg: "ok" });

const batch = (n = 1) => ok({ success_count: n });

/** 站点配置 */

const mockFriends = [
  {
    id: 1,
    link_name: "示例站点",
    link_avatar: "",
    link_address: "https://example.com",
    link_intro: "一个示例站点",
    created_at: baseTime,
    updated_at: baseTime,
  },
  {
    id: 2,
    link_name: "技术博客",
    link_avatar: "",
    link_address: "https://blog.example.com",
    link_intro: "技术分享",
    created_at: baseTime,
    updated_at: baseTime,
  },
];

/** 说说 */

const mockPages = [
  {
    id: 1,
    page_name: "about",
    page_label: "关于本站",
    page_cover: "",
    is_carousel: 0,
    carousel_covers: [],
    created_at: baseTime,
    updated_at: baseTime,
  },
  {
    id: 2,
    page_name: "home",
    page_label: "首页轮播",
    page_cover: "",
    is_carousel: 1,
    carousel_covers: [],
    created_at: baseTime,
    updated_at: baseTime,
  },
];

const mockWebsiteConfig = {
  admin_url: "https://admin.example.com",
  websocket_url: "ws://localhost:9421/admin-api/v1/websocket",
  tourist_avatar: "",
  user_avatar: "",
  website_feature: {
    is_chat_room: 1,
    is_ai_assistant: 0,
    is_music_player: 0,
    is_comment_review: 1,
    is_email_notice: 0,
    is_message_review: 1,
    is_reward: 0,
  },
  website_info: {
    website_author: "站长",
    website_avatar: "",
    website_create_time: "2024-01-01",
    website_intro: "一个用于演示的博客站点",
    website_name: "示例博客",
    website_notice: "欢迎访问",
    website_record_no: "",
  },
  reward_qr_code: {
    alipay_qr_code: "",
    weixin_qr_code: "",
  },
  social_login_list: [],
  social_url_list: [
    { name: "GitHub", platform: "github", link_url: "https://github.com", enabled: true },
  ],
};

/** 系统状态 */

export default defineMock([
  {
    url: "about-me",
    method: ["GET"],
    body: ok({ content: "# 关于我\n\n这里是模拟数据。" }),
  },
  { url: "website-config", method: ["GET"], body: ok(mockWebsiteConfig) },
  { url: "about-me", method: ["PUT"], body: ok({}) },
  { url: "website-config", method: ["PUT"], body: ok({}) },
  {
    url: "friends",
    method: ["GET"],
    body: ok({ list: mockFriends, total: mockFriends.length }),
  },
  { url: "friends", method: ["POST"], body: ok(mockFriends[0]) },
  { url: "friends/:id", method: ["PUT"], body: ok(mockFriends[0]) },
  { url: "friends/batch-delete", method: ["POST"], body: batch() },
  {
    url: "pages",
    method: ["GET"],
    body: ok({ list: mockPages, total: mockPages.length }),
  },
  { url: "pages", method: ["POST"], body: ok(mockPages[0]) },
  { url: "pages/:id", method: ["PUT"], body: ok(mockPages[0]) },
  { url: "pages/batch-delete", method: ["POST"], body: batch() },
]);
