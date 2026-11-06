import request from "@/utils/request";
import type { ListResult, QueryUserNotificationListReq } from "@/api/types";

/**
 * 用户收件箱（只读）
 *
 * 排障入口：管理员不代用户改读状态，只能按用户查看条目级记录。
 */
export const UserNotificationAPI = {
  /** 按用户查看收件箱条目 */
  queryUserNotificationList(
    params: QueryUserNotificationListReq
  ): Promise<ApiResponse<ListResult>> {
    return request({
      url: `/admin-api/v1/users/${params.user_id}/notifications`,
      method: "GET",
      params: params,
    });
  },
};
