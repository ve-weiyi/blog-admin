import request from "@/utils/request";
import type {
  BatchResp,
  CreateRoleReq,
  DeleteRoleReq,
  EmptyResp,
  GetRolePermissionsReq,
  GetRoleReq,
  ListResult,
  QueryRoleListReq,
  RolePermissionsResp,
  RoleVO,
  UpdateRoleApiPermissionsReq,
  UpdateRoleMenuPermissionsReq,
  UpdateRoleReq,
} from "@/api/types";

/** 角色管理 */
export const RoleAPI = {
  /** 获取角色列表 */
  queryRoleList(params?: QueryRoleListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/roles`,
      method: "GET",
      params: params,
    });
  },

  /** 创建角色 */
  createRole(data?: CreateRoleReq): Promise<ApiResponse<RoleVO>> {
    return request({
      url: `/admin-api/v1/roles`,
      method: "POST",
      data: data,
    });
  },

  /** 获取角色详情 */
  getRole(params: GetRoleReq): Promise<ApiResponse<RoleVO>> {
    return request({
      url: `/admin-api/v1/roles/${params.id}`,
      method: "GET",
      params: params,
    });
  },

  /** 更新角色信息 */
  updateRole(data: UpdateRoleReq): Promise<ApiResponse<RoleVO>> {
    return request({
      url: `/admin-api/v1/roles/${data.id}`,
      method: "PUT",
      data: data,
    });
  },

  /** 更新角色接口权限 */
  updateRoleApiPermissions(data: UpdateRoleApiPermissionsReq): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/roles/${data.role_id}/apis`,
      method: "PUT",
      data: data,
    });
  },

  /** 更新角色菜单权限 */
  updateRoleMenuPermissions(data: UpdateRoleMenuPermissionsReq): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/roles/${data.role_id}/menus`,
      method: "PUT",
      data: data,
    });
  },

  /** 查询角色权限配置 */
  getRolePermissions(params: GetRolePermissionsReq): Promise<ApiResponse<RolePermissionsResp>> {
    return request({
      url: `/admin-api/v1/roles/${params.role_id}/permissions`,
      method: "GET",
      params: params,
    });
  },

  /** 批量删除角色 */
  batchDeleteRole(data?: DeleteRoleReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/roles/batch-delete`,
      method: "POST",
      data: data,
    });
  },
};
