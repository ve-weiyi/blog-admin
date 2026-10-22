import request from "@/utils/request";
import type {
  BatchResp,
  CreateNotifyMessageReq,
  DeleteNotifyMessageReq,
  GetNotifyMessageReq,
  ListResult,
  NotifyMessageVO,
  PublishNotifyMessageReq,
  QueryNotifyMessageListReq,
  RevokeNotifyMessageReq,
  UpdateNotifyMessageReq,
} from "@/api/types";

/** 通知消息管理 */
export const NotifyMessageAPI = {
  /** 获取统一通知消息列表 */
  queryNotifyMessageList(params?: QueryNotifyMessageListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/notify-messages`,
      method: "GET",
      params: params,
    });
  },

  /** 创建统一通知消息 */
  createNotifyMessage(data?: CreateNotifyMessageReq): Promise<ApiResponse<NotifyMessageVO>> {
    return request({
      url: `/admin-api/v1/notify-messages`,
      method: "POST",
      data: data,
    });
  },

  /** 获取统一通知消息详情 */
  getNotifyMessage(params: GetNotifyMessageReq): Promise<ApiResponse<NotifyMessageVO>> {
    return request({
      url: `/admin-api/v1/notify-messages/${params.id}`,
      method: "GET",
      params: params,
    });
  },

  /** 更新统一通知消息 */
  updateNotifyMessage(data: UpdateNotifyMessageReq): Promise<ApiResponse<NotifyMessageVO>> {
    return request({
      url: `/admin-api/v1/notify-messages/${data.id}`,
      method: "PUT",
      data: data,
    });
  },

  /** 发布统一通知消息 */
  publishNotifyMessage(params: PublishNotifyMessageReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/notify-messages/${params.id}/publish`,
      method: "POST",
      params: params,
    });
  },

  /** 撤回统一通知消息 */
  revokeNotifyMessage(params: RevokeNotifyMessageReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/notify-messages/${params.id}/revoke`,
      method: "POST",
      params: params,
    });
  },

  /** 批量删除统一通知消息 */
  batchDeleteNotifyMessage(data?: DeleteNotifyMessageReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/notify-messages/batch-delete`,
      method: "POST",
      data: data,
    });
  },
};
