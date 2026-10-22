import request from "@/utils/request";
import type {
  BatchResp,
  CreateFriendReq,
  DeleteFriendReq,
  FriendVO,
  ListResult,
  QueryFriendListReq,
  UpdateFriendReq,
} from "@/api/types";

/** 友链管理 */
export const FriendAPI = {
  /** 获取友链列表 */
  queryFriendList(params?: QueryFriendListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/friends`,
      method: "GET",
      params: params,
    });
  },

  /** 创建友链 */
  createFriend(data?: CreateFriendReq): Promise<ApiResponse<FriendVO>> {
    return request({
      url: `/admin-api/v1/friends`,
      method: "POST",
      data: data,
    });
  },

  /** 更新友链 */
  updateFriend(data: UpdateFriendReq): Promise<ApiResponse<FriendVO>> {
    return request({
      url: `/admin-api/v1/friends/${data.id}`,
      method: "PUT",
      data: data,
    });
  },

  /** 批量删除友链 */
  batchDeleteFriend(data?: DeleteFriendReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/friends/batch-delete`,
      method: "POST",
      data: data,
    });
  },
};
