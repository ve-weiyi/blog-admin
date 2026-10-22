import request from "@/utils/request";
import type {
  BatchResp,
  CreateNotifyTemplateReq,
  DeleteNotifyTemplateReq,
  GetNotifyTemplateReq,
  ListResult,
  NotifyTemplateVO,
  QueryNotifyTemplateListReq,
  UpdateNotifyTemplateReq,
} from "@/api/types";

/** 通知模板管理 */
export const NotifyTemplateAPI = {
  /** 获取通知模板列表 */
  queryNotifyTemplateList(params?: QueryNotifyTemplateListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/notify-templates`,
      method: "GET",
      params: params,
    });
  },

  /** 创建通知模板 */
  createNotifyTemplate(data?: CreateNotifyTemplateReq): Promise<ApiResponse<NotifyTemplateVO>> {
    return request({
      url: `/admin-api/v1/notify-templates`,
      method: "POST",
      data: data,
    });
  },

  /** 获取通知模板详情 */
  getNotifyTemplate(params: GetNotifyTemplateReq): Promise<ApiResponse<NotifyTemplateVO>> {
    return request({
      url: `/admin-api/v1/notify-templates/${params.id}`,
      method: "GET",
      params: params,
    });
  },

  /** 更新通知模板 */
  updateNotifyTemplate(data: UpdateNotifyTemplateReq): Promise<ApiResponse<NotifyTemplateVO>> {
    return request({
      url: `/admin-api/v1/notify-templates/${data.id}`,
      method: "PUT",
      data: data,
    });
  },

  /** 批量删除通知模板 */
  batchDeleteNotifyTemplate(data?: DeleteNotifyTemplateReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/notify-templates/batch-delete`,
      method: "POST",
      data: data,
    });
  },
};
