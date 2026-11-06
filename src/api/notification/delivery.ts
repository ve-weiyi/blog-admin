import request from "@/utils/request";
import type {
  BatchResp,
  EmptyResp,
  IdsReq,
  ListResult,
  QueryDeliveryListReq,
  RedeliverDeliveryReq,
} from "@/api/types";

/** 投递记录：只含外部渠道，站内信的投递就是条目本身 */
export const DeliveryAPI = {
  /** 获取投递记录列表 */
  queryDeliveryList(params?: QueryDeliveryListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/notification-deliveries`,
      method: "GET",
      params: params,
    });
  },

  /** 批量删除投递记录 */
  batchDeleteDelivery(data: IdsReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/notification-deliveries/batch-delete`,
      method: "POST",
      data: data,
    });
  },

  /** 按投递记录重发 */
  redeliverDelivery(data: RedeliverDeliveryReq): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/notification-deliveries/${data.id}/redeliver`,
      method: "POST",
      data: data,
    });
  },
};
