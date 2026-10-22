import request from "@/utils/request";
import type {
  BatchResp,
  CreateTagReq,
  DeleteTagReq,
  ListResult,
  QueryTagListReq,
  TagVO,
  UpdateTagReq,
} from "@/api/types";

/** 标签管理 */
export const TagAPI = {
  /** 获取标签列表 */
  queryTagList(params?: QueryTagListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/tags`,
      method: "GET",
      params: params,
    });
  },

  /** 创建标签 */
  createTag(data?: CreateTagReq): Promise<ApiResponse<TagVO>> {
    return request({
      url: `/admin-api/v1/tags`,
      method: "POST",
      data: data,
    });
  },

  /** 更新标签 */
  updateTag(data: UpdateTagReq): Promise<ApiResponse<TagVO>> {
    return request({
      url: `/admin-api/v1/tags/${data.id}`,
      method: "PUT",
      data: data,
    });
  },

  /** 批量删除标签 */
  batchDeleteTag(data?: DeleteTagReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/tags/batch-delete`,
      method: "POST",
      data: data,
    });
  },
};
