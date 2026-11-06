import request from "@/utils/request";

/** WebSocket */
export const WebsocketAPI = {
  /** WebSocket消息 */
  websocket(): Promise<ApiResponse<any>> {
    return request({
      url: `/admin-api/v1/websocket`,
      method: "GET",
    });
  },
};
