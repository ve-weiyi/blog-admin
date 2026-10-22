import { defineMock } from "./base";

const mockArticleStatistics = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(Date.now() - (6 - i) * 86400000).toISOString().slice(0, 10),
  count: 3 + i,
}));

const mockArticleViewRanks = [
  { id: 1, article_title: "Vue3 组合式 API 实践", view_count: 1280 },
  { id: 2, article_title: "Go 并发模式", view_count: 960 },
  { id: 3, article_title: "容器化部署笔记", view_count: 720 },
];

const mockCategoryOverview = [
  { id: 1, category_name: "技术", article_count: 32 },
  { id: 2, category_name: "生活", article_count: 18 },
  { id: 3, category_name: "随笔", article_count: 11 },
];

const mockRegionStats = [
  { region: "广东", count: 320 },
  { region: "北京", count: 280 },
  { region: "浙江", count: 210 },
  { region: "上海", count: 180 },
  { region: "四川", count: 120 },
];

const mockSystemState = {
  os: {
    goos: "darwin",
    numCpu: 8,
    compiler: "gc",
    goVersion: "go1.22",
    numGoroutine: 24,
  },
  cpu: {
    cores: 2,
    cpus: [{ modelName: "Apple M2", cores: 4, cpu: 12.5 }],
  },
  ram: { totalMb: 16384, usedMb: 6144 },
  disk: { totalMb: 512000, usedMb: 204800, totalGb: 500, usedGb: 200, usedPercent: 40 },
};

/** 页面配置 */

const mockTagOverview = [
  { id: 1, tag_name: "Vue", article_count: 14 },
  { id: 2, tag_name: "Go", article_count: 9 },
  { id: 3, tag_name: "Docker", article_count: 6 },
];

const mockTrend = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(Date.now() - (6 - i) * 86400000).toISOString().slice(0, 10);
  const base = 100 + i * 12;
  return {
    date,
    new_users: 5 + i,
    total_users: 1200 + i * 10,
    active_users: base,
    uv_count: base * 3,
    pv_count: base * 12,
    total_uv_count: 12000 + i * 100,
    total_pv_count: 55000 + i * 500,
  };
});

const ok = (data: unknown) => ({ code: "SUCCESS", data, message: "ok" });

export default defineMock([
  {
    url: "stats/dashboard",
    method: ["GET"],
    body: {
      code: "SUCCESS",
      data: {
        user_count: 1280,
        article_count: 61,
        message_count: 47,
        today: mockTrend[mockTrend.length - 1],
        uv_growth_rate: 12.5,
        pv_growth_rate: 8.3,
        user_growth_rate: 4.1,
      },
      message: "ok",
    },
  },
  {
    url: "stats/visit-trend",
    method: ["GET"],
    body: { code: "SUCCESS", data: { list: mockTrend }, message: "ok" },
  },
  {
    url: "stats/article",
    method: ["GET"],
    body: {
      code: "SUCCESS",
      data: {
        category_list: mockCategoryOverview,
        tag_list: mockTagOverview,
        article_view_ranks: mockArticleViewRanks,
        article_statistics: mockArticleStatistics,
      },
      message: "ok",
    },
  },
  {
    url: "stats/geo",
    method: ["GET"],
    body: {
      code: "SUCCESS",
      data: { users: mockRegionStats, visitors: mockRegionStats },
      message: "ok",
    },
  },
  { url: "stats/system", method: ["GET"], body: ok(mockSystemState) },
]);
