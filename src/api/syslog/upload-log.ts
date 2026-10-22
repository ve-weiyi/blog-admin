import request from "@/utils/request";
import type {
  BatchResp,
  DeleteUploadLogReq,
  ListResult,
  QueryUploadLogListReq,
} from "@/api/types";

/** 文件日志 */
export const UploadLogAPI = {
  /** 获取文件日志列表 */
  queryUploadLogList(params?: QueryUploadLogListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/upload-logs`,
      method: "GET",
      params: params,
    });
  },

  /** 批量删除文件日志 */
  batchDeleteUploadLog(data?: DeleteUploadLogReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/upload-logs/batch-delete`,
      method: "POST",
      data: data,
    });
  },
};
