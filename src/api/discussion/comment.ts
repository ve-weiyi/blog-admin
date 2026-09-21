import request from "@/utils/request";
import type {
  BatchResp,
  DeleteCommentReq,
  ListResult,
  PatchCommentsReq,
  QueryCommentListReq,
} from "@/api/types";

/** 评论管理 */
export const CommentAPI = {
  /** 获取评论列表(后台) */
  queryCommentList(params?: QueryCommentListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/comments`,
      method: "GET",
      params: params,
    });
  },

  /** 部分更新评论（批量） */
  patchComments(data?: PatchCommentsReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/comments`,
      method: "PATCH",
      data: data,
    });
  },

  /** 批量删除评论 */
  batchDeleteComment(data?: DeleteCommentReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/comments/batch-delete`,
      method: "POST",
      data: data,
    });
  },
};
