import request from "@/utils/request";
import type {
  BatchResp,
  BatchReviewCommentsReq,
  DeleteCommentReq,
  EmptyResp,
  ListResult,
  PatchCommentsReq,
  QueryCommentListReq,
  ReviewCommentReq,
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

  /** 审核评论 */
  reviewComment(data: ReviewCommentReq): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/comments/${data.id}/review`,
      method: "PATCH",
      data: { is_review: data.is_review },
    });
  },

  /** 批量审核评论 */
  batchReviewComments(data: BatchReviewCommentsReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/comments/batch-review`,
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
