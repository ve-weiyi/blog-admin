import request from "@/utils/request";
import type {
  GetGuestReq,
  GetGuestResp,
  ListResult,
  QueryGuestListReq,
} from "@/api/types";

/** 访客管理 */
export const GuestAPI = {
  /** 获取游客信息 */
  getGuest(params?: GetGuestReq): Promise<ApiResponse<GetGuestResp>> {
    return request({
      url: `/admin-api/v1/guests/current`,
      method: "GET",
      params: params,
    });
  },

  /** 获取访客列表 */
  queryGuestList(params?: QueryGuestListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/guests`,
      method: "GET",
      params: params,
    });
  },
};
