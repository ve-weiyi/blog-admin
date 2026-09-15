import type { IContentConfig } from "@/components/CURD/types";
import type { QueryNotifyMessageListReq } from "@/api/types";
import { NotifyMessageAPI } from "@/api";
import { NotifyStatusEnum } from "@/enums/blog";

const contentConfig: IContentConfig<QueryNotifyMessageListReq> = {
  pageTitle: "通知管理",
  permPrefix: "website:notice",
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
  indexAction(query: QueryNotifyMessageListReq) {
    return NotifyMessageAPI.queryNotifyMessageList(query);
  },
  deleteAction(ids: string) {
    return NotifyMessageAPI.batchDeleteNotifyMessage({
      ids: ids.split(",").map((id) => parseInt(id)),
    });
  },
  pk: "id",
  toolbar: [
    {
      name: "add",
      text: "新增",
      perm: "add",
      attrs: {
        icon: "plus",
        type: "success",
      },
    },
    {
      name: "delete",
      text: "删除",
      perm: "delete",
      attrs: {
        icon: "delete",
        type: "danger",
      },
    },
  ],
  defaultToolbar: ["refresh", "filter", "search"],
  cols: [
    {
      type: "selection",
      label: "批量操作",
      width: 50,
      align: "center",
    },
    {
      label: "id",
      prop: "id",
      width: 70,
      align: "center",
      sortable: true,
    },
    {
      label: "通知标题",
      prop: "title",
      minWidth: 200,
      width: 0,
      align: "center",
    },
    {
      label: "通知内容",
      prop: "content",
      minWidth: 300,
      width: 0,
      align: "center",
      show: false,
    },
    {
      label: "通知分类",
      prop: "category",
      width: 120,
      align: "center",
      templet: "custom",
    },
    {
      label: "通知等级",
      prop: "level",
      width: 100,
      align: "center",
      templet: "custom",
    },
    {
      label: "发布状态",
      prop: "status",
      width: 100,
      align: "center",
      templet: "custom",
    },
    {
      label: "发布时间",
      prop: "published_at",
      width: 170,
      align: "center",
      sortable: true,
      templet: "date",
      dateFormat: "YYYY/MM/DD HH:mm:ss",
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
      show: false,
    },
    {
      label: "操作栏",
      align: "center",
      fixed: "right",
      width: 220,
      templet: "tool",
      operat: [
        {
          name: "publish",
          text: "发布",
          perm: "publish",
          attrs: { link: true, size: "small", type: "success" },
          render: (row: any) => row.status === NotifyStatusEnum.DRAFT,
        },
        {
          name: "revoke",
          text: "撤回",
          perm: "revoke",
          attrs: { link: true, size: "small", type: "warning" },
          render: (row: any) => row.status === NotifyStatusEnum.PUBLISHED,
        },
        {
          name: "edit",
          text: "编辑",
          perm: "edit",
          attrs: {
            icon: "edit",
            type: "primary",
          },
        },
        {
          name: "delete",
          text: "删除",
          perm: "delete",
          attrs: {
            icon: "delete",
            type: "danger",
          },
        },
      ],
    },
  ],
};

export default contentConfig;
