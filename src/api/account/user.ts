import request from "@/utils/request";
import type {
  EmptyReq,
  GetUserDetailReq,
  GetUserDetailResp,
  ListResult,
  OnlineUserListResp,
  QueryUserListReq,
  ResetUserPasswordReq,
  ResetUserPasswordResp,
  UpdateUserRolesReq,
  UpdateUserRolesResp,
  UpdateUserStatusReq,
  UpdateUserStatusResp,
} from "@/api/types";

/** 用户管理 */
export const UserAPI = {
  /** 获取用户列表 */
  queryUserList(params?: QueryUserListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/users`,
      method: "GET",
      params: params,
    });
  },

  /** 获取用户详情 */
  getUserDetail(params: GetUserDetailReq): Promise<ApiResponse<GetUserDetailResp>> {
    return request({
      url: `/admin-api/v1/users/${params.user_id}`,
      method: "GET",
      params: params,
    });
  },

  /** 更新用户状态 */
  updateUserStatus(data: UpdateUserStatusReq): Promise<ApiResponse<UpdateUserStatusResp>> {
    return request({
      url: `/admin-api/v1/users/${data.user_id}`,
      method: "PATCH",
      data: data,
    });
  },

  /** 重置用户密码 */
  resetUserPassword(data: ResetUserPasswordReq): Promise<ApiResponse<ResetUserPasswordResp>> {
    return request({
      url: `/admin-api/v1/users/${data.user_id}/reset-password`,
      method: "POST",
      data: data,
    });
  },

  /** 更新用户角色 */
  updateUserRoles(data: UpdateUserRolesReq): Promise<ApiResponse<UpdateUserRolesResp>> {
    return request({
      url: `/admin-api/v1/users/${data.user_id}/roles`,
      method: "PUT",
      data: data,
    });
  },

  /** 获取在线用户列表 */
  getOnlineUsers(params?: EmptyReq): Promise<ApiResponse<OnlineUserListResp>> {
    return request({
      url: `/admin-api/v1/users/online`,
      method: "GET",
      params: params,
    });
  },
};
