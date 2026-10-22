import request from "@/utils/request";
import type {
  BatchResp,
  CreatePhotoReq,
  DeletePhotoReq,
  DestroyPhotoReq,
  ListResult,
  PhotoVO,
  QueryPhotoListReq,
  RestorePhotoReq,
  UpdatePhotoReq,
} from "@/api/types";

/** 照片管理 */
export const PhotoAPI = {
  /** 获取照片列表 */
  queryPhotoList(params?: QueryPhotoListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/photos`,
      method: "GET",
      params: params,
    });
  },

  /** 创建照片 */
  createPhoto(data?: CreatePhotoReq): Promise<ApiResponse<PhotoVO>> {
    return request({
      url: `/admin-api/v1/photos`,
      method: "POST",
      data: data,
    });
  },

  /** 更新照片 */
  updatePhoto(data: UpdatePhotoReq): Promise<ApiResponse<PhotoVO>> {
    return request({
      url: `/admin-api/v1/photos/${data.id}`,
      method: "PUT",
      data: data,
    });
  },

  /** 批量删除照片（移入回收站） */
  batchDeletePhoto(data?: DeletePhotoReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/photos/batch-delete`,
      method: "POST",
      data: data,
    });
  },

  /** 批量销毁照片（彻底删除，不可恢复） */
  batchDestroyPhoto(data?: DestroyPhotoReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/photos/batch-destroy`,
      method: "POST",
      data: data,
    });
  },

  /** 批量恢复照片 */
  batchRestorePhoto(data?: RestorePhotoReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/photos/batch-restore`,
      method: "POST",
      data: data,
    });
  },
};
