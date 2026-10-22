import request from "@/utils/request";
import type {
  AboutMeVO,
  EmptyReq,
  EmptyResp,
  WebsiteConfigVO,
} from "@/api/types";

/** 网站管理 */
export const ConfigAPI = {
  /** 获取关于我的信息 */
  getAboutMe(params?: EmptyReq): Promise<ApiResponse<AboutMeVO>> {
    return request({
      url: `/admin-api/v1/about-me`,
      method: "GET",
      params: params,
    });
  },

  /** 更新关于我的信息（请求体与响应共用 AboutMeVO，同上） */
  updateAboutMe(data?: AboutMeVO): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/about-me`,
      method: "PUT",
      data: data,
    });
  },

  /** 获取网站配置 */
  getWebsiteConfig(params?: EmptyReq): Promise<ApiResponse<WebsiteConfigVO>> {
    return request({
      url: `/admin-api/v1/website-config`,
      method: "GET",
      params: params,
    });
  },

  /** 更新网站配置（请求体与响应共用 WebsiteConfigVO：单例配置对象，无服务端生成字段，二者同构） */
  updateWebsiteConfig(data?: WebsiteConfigVO): Promise<ApiResponse<EmptyResp>> {
    return request({
      url: `/admin-api/v1/website-config`,
      method: "PUT",
      data: data,
    });
  },
};
