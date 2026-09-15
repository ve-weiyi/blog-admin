import type { IContentConfig } from "@/components/CURD/types";
import type { QueryVisitLogListReq } from "@/api/types";
import { VisitLogAPI } from "@/api";

const contentConfig: IContentConfig<QueryVisitLogListReq> = {
  pageTitle: "服务日志",
  permPrefix: "log:visit",
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
  indexAction(query) {
    return VisitLogAPI.queryVisitLogList(query);
  },
  deleteAction(ids: string) {
    return VisitLogAPI.batchDeleteVisitLog({
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
    },
    {
      label: "用户id",
      prop: "user_id",
      width: 120,
      align: "center",
      show: false,
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
      label: "页面",
      prop: "page_name",
      width: 0,
      minWidth: 120,
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
