import request from "@/utils/request";
import type {
  CreateUploadTokenReq,
  CreateUploadTokenResp,
  QueryFileListReq,
  QueryFileListResp,
  UploadFileReq,
  UploadFileResp,
} from "@/api/types";

/** 文件上传 */
export const UploadAPI = {
  /** 上传文件（服务端上传） */
  uploadFile(data: UploadFileReq): Promise<ApiResponse<UploadFileResp>> {
    const formData = new FormData();
    if (data.file !== undefined) {
      formData.append("file", data.file);
    }
    if (data.file_base !== undefined) {
      formData.append("file_base", data.file_base);
    }

    return request({
      url: `/admin-api/v1/files`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /** 查询上传文件列表 */
  queryFileList(params?: QueryFileListReq): Promise<ApiResponse<QueryFileListResp>> {
    return request({
      url: `/admin-api/v1/files`,
      method: "GET",
      params: params,
    });
  },

  /** 获取上传凭证（前端直传） */
  createUploadToken(data?: CreateUploadTokenReq): Promise<ApiResponse<CreateUploadTokenResp>> {
    return request({
      url: `/admin-api/v1/upload-tokens`,
      method: "POST",
      data: data,
    });
  },
};
