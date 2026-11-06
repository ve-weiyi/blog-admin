import { store } from "@/stores";
import { MeNotificationAPI } from "@/api";
import { AuthStorage } from "@/utils/auth";

/**
 * 我的通知
 *
 * 未读数由服务端派生，客户端只负责取回；不做本地加减，避免与服务端漂移。
 * 实时信号只是提醒，拉取失败时保留旧值——闪回 0 比慢一拍更打扰人。
 */
export const useNotificationStore = defineStore("notification", () => {
  const unreadTotal = ref(0);

  /** 标记一组已读：组键由服务端下发，客户端不自己拼 */
  function markAsRead(groupKey: string) {
    const prev = unreadTotal.value;
    unreadTotal.value = Math.max(0, unreadTotal.value - 1);
    MeNotificationAPI.readMeNotification({ group_key: groupKey }).catch(() => {
      unreadTotal.value = prev;
    });
  }

  function markAllAsRead() {
    return MeNotificationAPI.readAllMeNotification().then(() => {
      unreadTotal.value = 0;
    });
  }

  /** 防抖窗口：批量发布/频繁重连时合并成一次请求 */
  const RefreshDebounceMs = 300;
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * 重新拉取未读数（防抖 300ms）
   *
   * 返回的 Promise 在请求发出前即已 resolve——调用方只关心"已安排刷新"。
   */
  function refreshUnread(): Promise<void> {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }
    refreshTimer = setTimeout(async () => {
      refreshTimer = null;
      // 凭据只从 AuthStorage 读：userInfo 是异步回填的展示态缓存
      if (!AuthStorage.getUid()) {
        return;
      }
      try {
        const res = await MeNotificationAPI.getMeUnreadCount();
        unreadTotal.value = res.data.total || 0;
      } catch {
        // 拉取失败保留旧值
      }
    }, RefreshDebounceMs);
    return Promise.resolve();
  }

  return {
    unreadTotal,
    markAsRead,
    markAllAsRead,
    refreshUnread,
  };
});

/**
 * 在组件外部使用 NotificationStore 的钩子函数
 *
 * 推送流是全局单例，回调发生在组件之外，必须带 pinia 实例调用
 *
 * @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function useNotificationStoreHook() {
  return useNotificationStore(store);
}
