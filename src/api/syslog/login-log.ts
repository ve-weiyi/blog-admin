import request from "@/utils/request";
import type {
  BatchResp,
  DeleteLoginLogReq,
  ListResult,
  QueryLoginLogListReq,
} from "@/api/types";

/** 登录日志 */
export const LoginLogAPI = {
  /** 获取登录日志列表 */
  queryLoginLogList(params?: QueryLoginLogListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/login-logs`,
      method: "GET",
      params: params,
    });
  },

  /** 批量删除登录日志 */
  batchDeleteLoginLog(data?: DeleteLoginLogReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/login-logs/batch-delete`,
      method: "POST",
      data: data,
    });
  },
};
