import request from "@/utils/request";
import type {
  BatchResp,
  CreateTalkReq,
  DeleteTalkReq,
  GetTalkReq,
  ListResult,
  QueryTalkListReq,
  TalkVO,
  UpdateTalkReq,
} from "@/api/types";

/** 说说管理 */
export const TalkAPI = {
  /** 获取说说列表 */
  queryTalkList(params?: QueryTalkListReq): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/talks`,
      method: "GET",
      params: params,
    });
  },

  /** 创建说说 */
  createTalk(data?: CreateTalkReq): Promise<ApiResponse<TalkVO>> {
    return request({
      url: `/admin-api/v1/talks`,
      method: "POST",
      data: data,
    });
  },

  /** 更新说说 */
  updateTalk(data: UpdateTalkReq): Promise<ApiResponse<TalkVO>> {
    return request({
      url: `/admin-api/v1/talks/${data.id}`,
      method: "PUT",
      data: data,
    });
  },

  /** 获取说说详情 */
  getTalk(params: GetTalkReq): Promise<ApiResponse<TalkVO>> {
    return request({
      url: `/admin-api/v1/talks/${params.id}`,
      method: "GET",
      params: params,
    });
  },

  /** 批量删除说说 */
  batchDeleteTalk(data?: DeleteTalkReq): Promise<ApiResponse<BatchResp>> {
    return request({
      url: `/admin-api/v1/talks/batch-delete`,
      method: "POST",
      data: data,
    });
  },
};
