import request from "@/utils/request";
import type {
  EmptyResp,
  ListResult,
  QueryNotificationEventListReq,
  QueryStalledEventListReq,
  RedeliverEventReq,
} from "@/api/types";

/** 通知事件：扇出的工作单元与进度 */
export const NotificationEventAPI = {
  /** 获取通知事件与扇出进度 */
  queryNotificationEventList(
    params?: QueryNotificationEventListReq
  ): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/notification-events`,
      method: "GET",
      params: params,
    });
  },

  /** 查询停滞的通知事件 */
  queryStalledEventList(params?: QueryStalledEventListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/notification-events/stalled`,
      method: "GET",
      params: params,
    });
  },

  /** 重新扇出事件 */
  redeliverEvent(data: RedeliverEventReq): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/notification-events/${data.id}/redeliver`,
      method: "POST",
      data: data,
    });
  },
};
