import type { IContentConfig } from "@/components/CURD/types";
import type { QueryFriendListReq } from "@/api/types";
import { FriendAPI } from "@/api";

const contentConfig: IContentConfig<QueryFriendListReq> = {
  pageTitle: "友链管理",
  permPrefix: "website:friend",
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
  indexAction(params: QueryFriendListReq) {
    if (!params.sorts) {
      params.sorts = [`id desc`];
    }

    return FriendAPI.queryFriendList(params);
  },
  deleteAction(ids: string) {
    return FriendAPI.batchDeleteFriend({
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
  defaultToolbar: ["refresh", "filter", "imports", "exports", "search"],
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
      label: "链接头像",
      prop: "link_avatar",
      width: 100,
      align: "center",
      templet: "image",
    },
    {
      label: "链接名称",
      prop: "link_name",
      width: 120,
      align: "center",
    },
    {
      label: "链接地址",
      prop: "link_address",
      width: 150,
      align: "center",
      templet: "url",
    },
    {
      label: "链接介绍",
      prop: "link_intro",
      minWidth: 200,
      width: 0,
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
      show: false,
    },
    {
      label: "操作栏",
      align: "center",
      fixed: "right",
      width: 160,
      templet: "tool",
      operat: [
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
