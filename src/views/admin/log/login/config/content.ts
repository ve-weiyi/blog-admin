import type { IContentConfig } from "@/components/CURD/types";
import type { QueryLoginLogListReq } from "@/api/types";
import { LoginLogAPI } from "@/api";

const contentConfig: IContentConfig<QueryLoginLogListReq> = {
  pageTitle: "登录日志",
  permPrefix: "log:login",
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
  indexAction(query: QueryLoginLogListReq) {
    return LoginLogAPI.queryLoginLogList(query);
  },
  deleteAction(ids: string) {
    return LoginLogAPI.batchDeleteLoginLog({
      ids: ids.split(",").map((id) => parseInt(id)),
    });
  },
  pk: "id",
  toolbar: [
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
      show: true,
    },
    {
      label: "用户",
      prop: "user_info",
      width: 150,
      align: "center",
      templet: "custom",
    },
    {
      label: "客户端",
      prop: "guest_info",
      width: 150,
      align: "center",
      templet: "custom",
    },
    {
      label: "登录类型",
      prop: "login_type",
      width: 120,
      align: "center",
      templet: "custom",
    },
    {
      label: "登录时间",
      prop: "login_at",
      width: 140,
      align: "center",
      templet: "date",
      dateFormat: "YYYY/MM/DD HH:mm:ss",
    },
    {
      label: "登出时间",
      prop: "logout_at",
      width: 140,
      align: "center",
      templet: "date",
      dateFormat: "YYYY/MM/DD HH:mm:ss",
    },
    {
      label: "操作栏",
      align: "center",
      fixed: "right",
      width: 160,
      templet: "tool",
      operat: [
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
