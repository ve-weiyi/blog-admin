import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import router from "@/router";
import { MeNotificationAPI } from "@/api";
import type { NotificationGroupVO } from "@/api/types";
import { useNotificationStore } from "@/stores/notification";

const PAGE_SIZE = 5;

export function useNotice() {
  const list = ref<NotificationGroupVO[]>([]);
  const detail = ref<NotificationGroupVO | null>(null);
  const dialogVisible = ref(false);
  const notificationStore = useNotificationStore();
  const { unreadTotal } = storeToRefs(notificationStore);

  // 收件人取自登录态，请求里不带 user_id
  function fetchList() {
    MeNotificationAPI.queryMeNotificationList({ page: 1, page_size: PAGE_SIZE })
      .then((res) => {
        list.value = (res.data.list || []) as NotificationGroupVO[];
        notificationStore.refreshUnread();
      })
      .catch(() => {
        // 拉取失败保留旧列表
      });
  }

  /** 打开一条：未读先置已读，再按服务端下发的跳转打开 */
  function read(item?: NotificationGroupVO) {
    if (!item) {
      return;
    }
    detail.value = item;
    dialogVisible.value = true;
    if (item.unread) {
      item.unread = false;
      notificationStore.markAsRead(item.group_key);
    }
  }

  function goMore() {
    router.push({ name: "MyNotice" });
  }

  function readAll() {
    notificationStore.markAllAsRead().then(() => {
      ElMessage.success("已全部标记为已读");
      fetchList();
    });
  }

  onMounted(() => {
    fetchList();
  });

  return {
    list,
    unreadTotal,
    detail,
    dialogVisible,
    read,
    readAll,
    goMore,
  };
}
