import request from "@/utils/request";
import type {
  BindMeEmailReq,
  BindMeMobileReq,
  BindMeThirdPartyReq,
  EmptyReq,
  EmptyResp,
  GetMeApisResp,
  GetMeMenusResp,
  GetMeReq,
  GetMeRolesResp,
  ListResult,
  QueryMeLoginLogListReq,
  UnbindMeThirdPartyReq,
  UpdateMeAvatarReq,
  UpdateMePasswordReq,
  UpdateMeReq,
  UserProfile,
} from "@/api/types";

/** 个人中心 */
export const MeAPI = {
  /** 获取用户接口权限 */
  getMeApis(params?: EmptyReq): Promise<ApiResponse<GetMeApisResp>> {
    return request({
      url: `/admin-api/v1/me/apis`,
      method: "GET",
      params: params,
    });
  },

  /** 修改用户头像 */
  updateMeAvatar(data?: UpdateMeAvatarReq): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/me/avatar`,
      method: "PUT",
      data: data,
    });
  },

  /** 绑定邮箱 */
  bindMeEmail(data?: BindMeEmailReq): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/me/bind-email`,
      method: "POST",
      data: data,
    });
  },

  /** 绑定手机号 */
  bindMeMobile(data?: BindMeMobileReq): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/me/bind-mobile`,
      method: "POST",
      data: data,
    });
  },

  /** 绑定第三方平台账号 */
  bindMeThirdParty(data?: BindMeThirdPartyReq): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/me/bind-third-party`,
      method: "POST",
      data: data,
    });
  },

  /** 查询用户登录历史 */
  queryMeLoginLogList(params?: QueryMeLoginLogListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/me/login-logs`,
      method: "GET",
      params: params,
    });
  },

  /** 获取用户菜单权限 */
  getMeMenus(params?: EmptyReq): Promise<ApiResponse<GetMeMenusResp>> {
    return request({
      url: `/admin-api/v1/me/menus`,
      method: "GET",
      params: params,
    });
  },

  /** 修改用户密码 */
  updateMePassword(data?: UpdateMePasswordReq): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/me/password`,
      method: "PUT",
      data: data,
    });
  },

  /** 获取当前用户信息 */
  getMe(params?: GetMeReq): Promise<ApiResponse<UserProfile>> {
    return request({
      url: `/admin-api/v1/me/profile`,
      method: "GET",
      params: params,
    });
  },

  /** 更新当前用户信息 */
  updateMe(data?: UpdateMeReq): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/me/profile`,
      method: "PUT",
      data: data,
    });
  },

  /** 获取用户角色 */
  getMeRoles(params?: EmptyReq): Promise<ApiResponse<GetMeRolesResp>> {
    return request({
      url: `/admin-api/v1/me/roles`,
      method: "GET",
      params: params,
    });
  },

  /** 解绑第三方平台账号 */
  unbindMeThirdParty(data?: UnbindMeThirdPartyReq): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/me/unbind-third-party`,
      method: "POST",
      data: data,
    });
  },
};
