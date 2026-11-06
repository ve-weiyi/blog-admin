import type { RouteRecordRaw } from "vue-router";

const Layout = () => import("@/layouts/index.vue");

export default {
  path: "/notification",
  name: "",
  component: Layout,
  redirect: "/notification/notice",
  meta: {
    title: "通知管理",
    icon: "el-icon-bell",
    rank: 7,
  },
  children: [
    {
      path: "/notification/notice",
      component: () => import("@/views/admin/notification/notice/Notice.vue"),
      name: "NotifyNotice",
      meta: { title: "公告管理" },
    },
    {
      path: "/notification/message",
      component: () => import("@/views/admin/notification/record/Record.vue"),
      name: "NotifyRecord",
      meta: { title: "投递记录" },
    },
    {
      path: "/notification/event",
      component: () => import("@/views/admin/notification/event/Event.vue"),
      name: "NotificationEvent",
      meta: { title: "通知事件" },
    },
  ],
} satisfies RouteRecordRaw;
