import { defineMock } from "./base";

const baseTime = 1700000000000;

const ok = (data: unknown) => ({ code: 200, data, msg: "ok" });

const batch = (n = 1) => ok({ success_count: n });

/** 文章 */

const mockArticles = [
  {
    id: 1,
    article_cover: "",
    article_title: "Vue3 组合式 API 实践",
    article_content: "<p>模拟正文</p>",
    article_type: 1,
    original_url: "",
    is_top: 1,
    is_delete: 0,
    status: 1,
    created_at: baseTime,
    updated_at: baseTime,
    category_name: "技术",
    tag_name_list: ["Vue", "前端"],
    like_count: 12,
    view_count: 340,
  },
  {
    id: 2,
    article_cover: "",
    article_title: "Go 并发模式笔记",
    article_content: "<p>模拟正文</p>",
    article_type: 1,
    original_url: "",
    is_top: 0,
    is_delete: 0,
    status: 1,
    created_at: baseTime,
    updated_at: baseTime,
    category_name: "技术",
    tag_name_list: ["Go"],
    like_count: 5,
    view_count: 120,
  },
];

/** 分类 */

const mockCategories = [
  { id: 1, category_name: "技术", article_count: 32, created_at: baseTime, updated_at: baseTime },
  { id: 2, category_name: "生活", article_count: 18, created_at: baseTime, updated_at: baseTime },
];

/** 标签 */

const mockTags = [
  { id: 1, tag_name: "Vue", article_count: 14, created_at: baseTime, updated_at: baseTime },
  { id: 2, tag_name: "Go", article_count: 9, created_at: baseTime, updated_at: baseTime },
];

export default defineMock([
  {
    url: "articles",
    method: ["GET"],
    body: ok({ list: mockArticles, total: mockArticles.length }),
  },
  { url: "articles/:id", method: ["GET"], body: ok(mockArticles[0]) },
  { url: "articles", method: ["POST"], body: ok(mockArticles[0]) },
  { url: "articles/:id", method: ["PUT"], body: ok(mockArticles[0]) },
  { url: "articles/:id", method: ["DELETE"], body: batch() },
  { url: "articles/:id", method: ["PATCH"], body: ok({}) },
  { url: "articles/export", method: ["POST"], body: ok({}) },
  {
    url: "categories",
    method: ["GET"],
    body: ok({ list: mockCategories, total: mockCategories.length }),
  },
  { url: "categories", method: ["POST"], body: ok(mockCategories[0]) },
  { url: "categories/:id", method: ["PUT"], body: ok(mockCategories[0]) },
  { url: "categories/batch-delete", method: ["POST"], body: batch() },
  {
    url: "tags",
    method: ["GET"],
    body: ok({ list: mockTags, total: mockTags.length }),
  },
  { url: "tags", method: ["POST"], body: ok(mockTags[0]) },
  { url: "tags/:id", method: ["PUT"], body: ok(mockTags[0]) },
  { url: "tags/batch-delete", method: ["POST"], body: batch() },
]);
