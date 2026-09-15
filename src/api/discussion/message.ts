import request from "@/utils/request";
import type {
  BatchResp,
  DeleteMessageReq,
  ListResult,
  PatchMessagesReq,
  QueryMessageListReq,
} from "@/api/types";

/** 留言管理 */
export const MessageAPI = {
  /** 获取留言列表 */
  queryMessageList(params?: QueryMessageListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/messages`,
      method: "GET",
      params: params,
    });
  },

  /** 部分更新留言（批量） */
  patchMessages(data?: PatchMessagesReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/messages`,
      method: "PATCH",
      data: data,
    });
  },

  /** 批量删除留言 */
  batchDeleteMessage(data?: DeleteMessageReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/messages/batch-delete`,
      method: "POST",
      data: data,
    });
  },
};
