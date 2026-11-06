import type { IContentConfig } from "@/components/CURD/types";
import type { QueryNotificationEventListReq } from "@/api/types";
import { NotificationEventAPI } from "@/api";

const contentConfig: IContentConfig<QueryNotificationEventListReq> = {
  pageTitle: "通知事件",
  permPrefix: "notification:event",
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  pagination: {
    background: true,
    layout: "prev,pager,next,jumper,total,sizes",
    pageSize: 10,
    pageSizes: [10, 20, 30, 50],
  },
  parseData: (res) => {
    return {
      total: res.data.total,
      list: res.data.list || [],
    };
  },
  indexAction(query: QueryNotificationEventListReq) {
    return NotificationEventAPI.queryNotificationEventList(query);
  },
  // 事件不提供删除：它是扇出的权威记录，回收只能按「已终止且无引用」的规则由清理任务处理
  pk: "id",
  toolbar: [],
  defaultToolbar: ["refresh", "filter", "search"],
  cols: [
    {
      label: "id",
      prop: "id",
      width: 80,
      align: "center",
      sortable: true,
    },
    {
      label: "场景",
      prop: "scene",
      width: 180,
      align: "center",
    },
    {
      label: "对象",
      prop: "object_type",
      width: 160,
      align: "center",
      templet: "custom",
    },
    {
      label: "触发者",
      prop: "actor_id",
      width: 140,
      align: "center",
    },
    {
      label: "状态",
      prop: "status",
      width: 110,
      align: "center",
      templet: "custom",
    },
    {
      label: "扇出进度",
      prop: "processed",
      width: 160,
      align: "center",
      templet: "custom",
    },
    {
      label: "受众类型",
      prop: "audience_type",
      width: 110,
      align: "center",
    },
    {
      label: "创建时间",
      prop: "created_at",
      width: 170,
      align: "center",
      sortable: true,
      templet: "date",
      dateFormat: "YYYY/MM/DD HH:mm:ss",
    },
    {
      label: "更新时间",
      prop: "updated_at",
      width: 170,
      align: "center",
      sortable: true,
      templet: "date",
      dateFormat: "YYYY/MM/DD HH:mm:ss",
    },
    {
      label: "操作栏",
      align: "center",
      fixed: "right",
      width: 100,
      templet: "tool",
      operat: [
        {
          name: "redeliver",
          text: "重发",
          perm: "edit",
          attrs: {
            icon: "refresh",
            type: "primary",
          },
        },
      ],
    },
  ],
};

export default contentConfig;
