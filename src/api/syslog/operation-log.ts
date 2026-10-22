import request from "@/utils/request";
import type {
  BatchResp,
  DeleteOperationLogReq,
  ListResult,
  QueryOperationLogListReq,
} from "@/api/types";

/** 操作日志 */
export const OperationLogAPI = {
  /** 获取操作日志列表 */
  queryOperationLogList(params?: QueryOperationLogListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/operation-logs`,
      method: "GET",
      params: params,
    });
  },

  /** 批量删除操作日志 */
  batchDeleteOperationLog(data?: DeleteOperationLogReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/operation-logs/batch-delete`,
      method: "POST",
      data: data,
    });
  },
};
