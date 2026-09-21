import request from "@/utils/request";
import type {
  AlbumVO,
  BatchResp,
  CreateAlbumReq,
  DeleteAlbumReq,
  DestroyAlbumReq,
  GetAlbumReq,
  ListResult,
  QueryAlbumListReq,
  RestoreAlbumReq,
  UpdateAlbumReq,
} from "@/api/types";

/** 相册管理 */
export const AlbumAPI = {
  /** 获取相册列表 */
  queryAlbumList(params?: QueryAlbumListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/albums`,
      method: "GET",
      params: params,
    });
  },

  /** 创建相册 */
  createAlbum(data?: CreateAlbumReq): Promise<ApiResponse<AlbumVO>> {
    return request({
      url: `/admin-api/v1/albums`,
      method: "POST",
      data: data,
    });
  },

  /** 获取相册详情 */
  getAlbum(params: GetAlbumReq): Promise<ApiResponse<AlbumVO>> {
    return request({
      url: `/admin-api/v1/albums/${params.id}`,
      method: "GET",
      params: params,
    });
  },

  /** 更新相册 */
  updateAlbum(data: UpdateAlbumReq): Promise<ApiResponse<AlbumVO>> {
    return request({
      url: `/admin-api/v1/albums/${data.id}`,
      method: "PUT",
      data: data,
    });
  },

  /** 批量删除相册（移入回收站） */
  batchDeleteAlbum(data?: DeleteAlbumReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/albums/batch-delete`,
      method: "POST",
      data: data,
    });
  },

  /** 批量销毁相册（彻底删除，不可恢复） */
  batchDestroyAlbum(data?: DestroyAlbumReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/albums/batch-destroy`,
      method: "POST",
      data: data,
    });
  },

  /** 批量恢复相册 */
  batchRestoreAlbum(data?: RestoreAlbumReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/albums/batch-restore`,
      method: "POST",
      data: data,
    });
  },
};
