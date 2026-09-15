import request from "@/utils/request";
import type {
  BatchMarkRecordsReadReq,
  BatchResp,
  DeleteNotifyRecordReq,
  ListResult,
  MarkAllRecordsReadReq,
  MarkRecordReadReq,
  QueryNotifyRecordListReq,
  QueryUserInboxRecordListReq,
  QueryUserInboxRecordListResp,
} from "@/api/types";

/** 投递记录管理 */
export const NotifyRecordAPI = {
  /** 查询用户 inbox 投递列表 */
  queryUserInboxRecordList(params?: QueryUserInboxRecordListReq): Promise<ApiResponse<QueryUserInboxRecordListResp>> {
    return request({
      url: `/admin-api/v1/inbox-records`,
      method: "GET",
      params: params,
    });
  },

  /** 标记单条投递记录为已读 */
  markRecordRead(params: MarkRecordReadReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/inbox-records/${params.id}/mark-read`,
      method: "POST",
      params: params,
    });
  },

  /** 批量标记投递记录为已读 */
  batchMarkRecordsRead(data?: BatchMarkRecordsReadReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/inbox-records/batch-mark-read`,
      method: "POST",
      data: data,
    });
  },

  /** 全部标记投递记录为已读 */
  markAllRecordsRead(data?: MarkAllRecordsReadReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/inbox-records/mark-all-read`,
      method: "POST",
      data: data,
    });
  },

  /** 获取统一投递记录列表 */
  queryNotifyRecordList(params?: QueryNotifyRecordListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/notify-records`,
      method: "GET",
      params: params,
    });
  },

  /** 批量删除投递记录 */
  batchDeleteNotifyRecord(data?: DeleteNotifyRecordReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/notify-records/batch-delete`,
      method: "POST",
      data: data,
    });
  },
};
