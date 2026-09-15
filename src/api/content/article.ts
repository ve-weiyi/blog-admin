import request from "@/utils/request";
import type {
  ArticleVO,
  BatchResp,
  CreateArticleReq,
  DeleteArticleReq,
  EmptyResp,
  ExportArticleReq,
  GetArticleReq,
  ListResult,
  PatchArticleReq,
  QueryArticleListReq,
  UpdateArticleReq,
} from "@/api/types";

/** 文章管理 */
export const ArticleAPI = {
  /** 获取文章列表 */
  queryArticleList(params?: QueryArticleListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/articles`,
      method: "GET",
      params: params,
    });
  },

  /** 创建文章 */
  createArticle(data?: CreateArticleReq): Promise<ApiResponse<ArticleVO>> {
    return request({
      url: `/admin-api/v1/articles`,
      method: "POST",
      data: data,
    });
  },

  /** 获取文章详情 */
  getArticle(params: GetArticleReq): Promise<ApiResponse<ArticleVO>> {
    return request({
      url: `/admin-api/v1/articles/${params.id}`,
      method: "GET",
      params: params,
    });
  },

  /** 更新文章 */
  updateArticle(data: UpdateArticleReq): Promise<ApiResponse<ArticleVO>> {
    return request({
      url: `/admin-api/v1/articles/${data.id}`,
      method: "PUT",
      data: data,
    });
  },

  /** 删除文章 */
  deleteArticle(params: DeleteArticleReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/articles/${params.id}`,
      method: "DELETE",
      params: params,
    });
  },

  /** 部分更新文章（置顶状态 / 删除状态） */
  patchArticle(data: PatchArticleReq): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/articles/${data.id}`,
      method: "PATCH",
      data: data,
    });
  },

  /** 导出文章列表 */
  exportArticle(data?: ExportArticleReq): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/articles/export`,
      method: "POST",
      data: data,
    });
  },
};
