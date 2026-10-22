import { store } from "@/stores";
import { NotifyRecordAPI } from "@/api";
import { AuthStorage } from "@/utils/auth";

export const useNotificationStore = defineStore("notification", () => {
  const unreadTotal = ref(0);

  function markAsRead(id: number) {
    const prev = unreadTotal.value;
    unreadTotal.value = Math.max(0, unreadTotal.value - 1);
    NotifyRecordAPI.markRecordRead({ id }).catch(() => {
      unreadTotal.value = prev;
    });
  }

  function markAllAsRead(userId: string) {
    return NotifyRecordAPI.markAllRecordsRead({ user_id: userId }).then(() => {
      unreadTotal.value = 0;
    });
  }

  /** 防抖窗口：批量发布/频繁重连时合并成一次请求 */
  const RefreshDebounceMs = 300;
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * 重新拉取未读数（防抖 300ms，只取未读数故 page_size 取 1）
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
      const userId = AuthStorage.getUid();
      if (!userId) {
        return;
      }
      try {
        const res = await NotifyRecordAPI.queryUserInboxRecordList({
          page: 1,
          page_size: 1,
          user_id: userId,
        });
        unreadTotal.value = res.data.unread_total || 0;
      } catch {
        // 拉取失败保留旧值：推送只是提醒，失败不该打扰用户
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
