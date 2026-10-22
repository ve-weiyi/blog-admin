import request from "@/utils/request";
import type {
  BatchResp,
  CreatePageReq,
  DeletePageReq,
  ListResult,
  PageVO,
  QueryPageListReq,
  UpdatePageReq,
} from "@/api/types";

/** 页面管理 */
export const PageAPI = {
  /** 获取页面列表 */
  queryPageList(params?: QueryPageListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/pages`,
      method: "GET",
      params: params,
    });
  },

  /** 创建页面 */
  createPage(data?: CreatePageReq): Promise<ApiResponse<PageVO>> {
    return request({
      url: `/admin-api/v1/pages`,
      method: "POST",
      data: data,
    });
  },

  /** 更新页面 */
  updatePage(data: UpdatePageReq): Promise<ApiResponse<PageVO>> {
    return request({
      url: `/admin-api/v1/pages/${data.id}`,
      method: "PUT",
      data: data,
    });
  },

  /** 批量删除页面 */
  batchDeletePage(data?: DeletePageReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/pages/batch-delete`,
      method: "POST",
      data: data,
    });
  },
};
