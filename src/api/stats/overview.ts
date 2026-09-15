import request from "@/utils/request";
import type {
  EmptyReq,
  GetArticleStatsResp,
  GetGeoStatsReq,
  GetGeoStatsResp,
  GetStatsDashboardResp,
  GetVisitTrendReq,
  GetVisitTrendResp,
  Server,
} from "@/api/types";

/** 数据统计 */
export const OverviewAPI = {
  /** 获取文章分析数据 */
  getArticleStats(params?: EmptyReq): Promise<ApiResponse<GetArticleStatsResp>> {
    return request({
      url: `/admin-api/v1/stats/article`,
      method: "GET",
      params: params,
    });
  },

  /** 获取仪表盘统计数据 */
  getDashboardStats(params?: EmptyReq): Promise<ApiResponse<GetStatsDashboardResp>> {
    return request({
      url: `/admin-api/v1/stats/dashboard`,
      method: "GET",
      params: params,
    });
  },

  /** 获取用户与访客的地区分布 */
  getGeoStats(params?: GetGeoStatsReq): Promise<ApiResponse<GetGeoStatsResp>> {
    return request({
      url: `/admin-api/v1/stats/geo`,
      method: "GET",
      params: params,
    });
  },

  /** 获取服务器信息 */
  getSystemInfo(params?: EmptyReq): Promise<ApiResponse<Server>> {
    return request({
      url: `/admin-api/v1/stats/system`,
      method: "GET",
      params: params,
    });
  },

  /** 获取访客数据趋势 */
  getVisitTrend(params?: GetVisitTrendReq): Promise<ApiResponse<GetVisitTrendResp>> {
    return request({
      url: `/admin-api/v1/stats/visit-trend`,
      method: "GET",
      params: params,
    });
  },
};
