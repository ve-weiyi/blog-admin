import request from "@/utils/request";
import type {
  BatchResp,
  CleanMenuReq,
  CleanMenuResp,
  CreateMenuReq,
  DeleteMenuReq,
  GetMenuReq,
  ListResult,
  MenuVO,
  QueryMenuListReq,
  SyncMenuReq,
  SyncMenuResp,
  UpdateMenuReq,
} from "@/api/types";

/** 菜单管理 */
export const MenuAPI = {
  /** 获取菜单列表 */
  queryMenuList(params?: QueryMenuListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/menus`,
      method: "GET",
      params: params,
    });
  },

  /** 创建菜单 */
  createMenu(data?: CreateMenuReq): Promise<ApiResponse<MenuVO>> {
    return request({
      url: `/admin-api/v1/menus`,
      method: "POST",
      data: data,
    });
  },

  /** 获取菜单详情 */
  getMenu(params: GetMenuReq): Promise<ApiResponse<MenuVO>> {
    return request({
      url: `/admin-api/v1/menus/${params.id}`,
      method: "GET",
      params: params,
    });
  },

  /** 更新菜单 */
  updateMenu(data: UpdateMenuReq): Promise<ApiResponse<MenuVO>> {
    return request({
      url: `/admin-api/v1/menus/${data.id}`,
      method: "PUT",
      data: data,
    });
  },

  /** 批量删除菜单 */
  batchDeleteMenu(data?: DeleteMenuReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/menus/batch-delete`,
      method: "POST",
      data: data,
    });
  },

  /** 清空菜单列表 */
  cleanMenu(params?: CleanMenuReq): Promise<ApiResponse<CleanMenuResp>> {
    return request({
      url: `/admin-api/v1/menus/clean`,
      method: "POST",
      params: params,
    });
  },

  /** 同步菜单列表 */
  syncMenu(data?: SyncMenuReq): Promise<ApiResponse<SyncMenuResp>> {
    return request({
      url: `/admin-api/v1/menus/sync`,
      method: "POST",
      data: data,
    });
  },
};
