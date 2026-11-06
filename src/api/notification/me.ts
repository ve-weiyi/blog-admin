import request from "@/utils/request";
import type {
  BatchResp,
  DeleteMeNotificationReq,
  ListResult,
  MeUnreadCountReq,
  MeUnreadCountResp,
  QueryMeNotificationListReq,
  ReadMeNotificationReq,
} from "@/api/types";

/**
 * 我的通知
 *
 * 收件人取自登录态，请求里没有 user_id；管理与读者共用同一份收件箱数据。
 */
export const MeNotificationAPI = {
  /** 获取我的通知列表（按分组） */
  queryMeNotificationList(params?: QueryMeNotificationListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/me/notifications`,
      method: "GET",
      params: params,
    });
  },

  /** 获取我的未读分组数 */
  getMeUnreadCount(params?: MeUnreadCountReq): Promise<ApiResponse<MeUnreadCountResp>> {
    return request({
      url: `/admin-api/v1/me/notifications/unread-count`,
      method: "GET",
      params: params,
    });
  },

  /** 标记一组已读 */
  readMeNotification(data: ReadMeNotificationReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/me/notifications/read`,
      method: "POST",
      data: data,
    });
  },

  /** 全部已读 */
  readAllMeNotification(): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/me/notifications/read-all`,
      method: "POST",
      data: {},
    });
  },

  /** 删除一组通知 */
  deleteMeNotification(data: DeleteMeNotificationReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/me/notifications/delete`,
      method: "POST",
      data: data,
    });
  },
};
