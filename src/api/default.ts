import request from "@/utils/request";
import type {
  PingReq,
  PingResp,
} from "@/api/types";

export const DefaultAPI = {
  /** ping */
  ping(params?: PingReq): Promise<ApiResponse<PingResp>> {
    return request({
      url: `/admin-api/v1/ping`,
      method: "GET",
      params: params,
    });
  },
};
