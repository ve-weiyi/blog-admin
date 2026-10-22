import request from "@/utils/request";
import type {
  BatchResp,
  CategoryVO,
  CreateCategoryReq,
  DeleteCategoryReq,
  ListResult,
  QueryCategoryListReq,
  UpdateCategoryReq,
} from "@/api/types";

/** 分类管理 */
export const CategoryAPI = {
  /** 获取分类列表 */
  queryCategoryList(params?: QueryCategoryListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/categories`,
      method: "GET",
      params: params,
    });
  },

  /** 创建分类 */
  createCategory(data?: CreateCategoryReq): Promise<ApiResponse<CategoryVO>> {
    return request({
      url: `/admin-api/v1/categories`,
      method: "POST",
      data: data,
    });
  },

  /** 更新分类 */
  updateCategory(data: UpdateCategoryReq): Promise<ApiResponse<CategoryVO>> {
    return request({
      url: `/admin-api/v1/categories/${data.id}`,
      method: "PUT",
      data: data,
    });
  },

  /** 批量删除分类 */
  batchDeleteCategory(data?: DeleteCategoryReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/categories/batch-delete`,
      method: "POST",
      data: data,
    });
  },
};
