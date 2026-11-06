import request from "@/utils/request";
import type {
  AnnouncementVO,
  BatchResp,
  CreateAnnouncementReq,
  GetAnnouncementReq,
  IdsReq,
  ListResult,
  PublishAnnouncementReq,
  QueryAnnouncementListReq,
  RevokeAnnouncementReq,
  UpdateAnnouncementReq,
} from "@/api/types";

/** 公告管理 */
export const AnnouncementAPI = {
  /** 获取公告列表 */
  queryAnnouncementList(params?: QueryAnnouncementListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/announcements`,
      method: "GET",
      params: params,
    });
  },

  /** 创建公告 */
  createAnnouncement(data?: CreateAnnouncementReq): Promise<ApiResponse<AnnouncementVO>> {
    return request({
      url: `/admin-api/v1/announcements`,
      method: "POST",
      data: data,
    });
  },

  /** 获取公告详情 */
  getAnnouncement(params: GetAnnouncementReq): Promise<ApiResponse<AnnouncementVO>> {
    return request({
      url: `/admin-api/v1/announcements/${params.id}`,
      method: "GET",
      params: params,
    });
  },

  /** 更新公告 */
  updateAnnouncement(data: UpdateAnnouncementReq): Promise<ApiResponse<AnnouncementVO>> {
    return request({
      url: `/admin-api/v1/announcements/${data.id}`,
      method: "PUT",
      data: data,
    });
  },

  /** 批量删除公告 */
  batchDeleteAnnouncement(data: IdsReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/announcements/batch-delete`,
      method: "POST",
      data: data,
    });
  },

  /** 发布公告 */
  publishAnnouncement(data: PublishAnnouncementReq): Promise<ApiResponse<AnnouncementVO>> {
    return request({
      url: `/admin-api/v1/announcements/${data.id}/publish`,
      method: "POST",
      data: data,
    });
  },

  /** 撤回公告 */
  revokeAnnouncement(data: RevokeAnnouncementReq): Promise<ApiResponse<AnnouncementVO>> {
    return request({
      url: `/admin-api/v1/announcements/${data.id}/revoke`,
      method: "POST",
      data: data,
    });
  },
};
