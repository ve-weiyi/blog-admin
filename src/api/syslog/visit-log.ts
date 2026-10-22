import request from "@/utils/request";
import type {
  BatchResp,
  DeleteVisitLogReq,
  ListResult,
  QueryVisitLogListReq,
} from "@/api/types";

/** 访问日志 */
export const VisitLogAPI = {
  /** 获取访问日志列表 */
  queryVisitLogList(params?: QueryVisitLogListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/visit-logs`,
      method: "GET",
      params: params,
    });
  },

  /** 批量删除访问日志 */
  batchDeleteVisitLog(data?: DeleteVisitLogReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/visit-logs/batch-delete`,
      method: "POST",
      data: data,
    });
  },
};
