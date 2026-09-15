import request from "@/utils/request";
import type {
  ApiVO,
  BatchResp,
  CleanApiResp,
  CreateApiReq,
  DeleteApiReq,
  EmptyReq,
  GetApiReq,
  ListResult,
  QueryApiListReq,
  SyncApiResp,
  UpdateApiReq,
} from "@/api/types";

/** 接口管理 */
export const ApiAPI = {
  /** 获取接口列表 */
  queryApiList(params?: QueryApiListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/apis`,
      method: "GET",
      params: params,
    });
  },

  /** 创建接口 */
  createApi(data?: CreateApiReq): Promise<ApiResponse<ApiVO>> {
    return request({
      url: `/admin-api/v1/apis`,
      method: "POST",
      data: data,
    });
  },

  /** 获取接口详情 */
  getApi(params: GetApiReq): Promise<ApiResponse<ApiVO>> {
    return request({
      url: `/admin-api/v1/apis/${params.id}`,
      method: "GET",
      params: params,
    });
  },

  /** 更新接口 */
  updateApi(data: UpdateApiReq): Promise<ApiResponse<ApiVO>> {
    return request({
      url: `/admin-api/v1/apis/${data.id}`,
      method: "PUT",
      data: data,
    });
  },

  /** 批量删除接口 */
  batchDeleteApi(data?: DeleteApiReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/apis/batch-delete`,
      method: "POST",
      data: data,
    });
  },

  /** 清空接口列表 */
  cleanApi(params?: EmptyReq): Promise<ApiResponse<CleanApiResp>> {
    return request({
      url: `/admin-api/v1/apis/clean`,
      method: "POST",
      params: params,
    });
  },

  /** 同步接口列表 */
  syncApi(params?: EmptyReq): Promise<ApiResponse<SyncApiResp>> {
    return request({
      url: `/admin-api/v1/apis/sync`,
      method: "POST",
      params: params,
    });
  },
};
