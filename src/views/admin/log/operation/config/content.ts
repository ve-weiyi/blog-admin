import type { IContentConfig } from "@/components/CURD/types";
import type { QueryOperationLogListReq } from "@/api/types";
import { OperationLogAPI } from "@/api";

const contentConfig: IContentConfig<QueryOperationLogListReq> = {
  pageTitle: "操作日志",
  permPrefix: "log:operation",
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
    return OperationLogAPI.queryOperationLogList(query);
  },
  deleteAction(ids: string) {
    return OperationLogAPI.batchDeleteOperationLog({
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
      label: "操作模块",
      prop: "module",
      width: 120,
      align: "center",
    },
    {
      label: "操作描述",
      prop: "description",
      width: 0,
      minWidth: 120,
      align: "center",
    },
    {
      label: "请求方法",
      prop: "request_method",
      width: 100,
      align: "center",
      templet: "custom",
    },
    {
      label: "请求地址",
      prop: "request_uri",
      width: 0,
      minWidth: 200,
      align: "center",
    },
    {
      label: "响应数据",
      prop: "response_data",
      width: 300,
      align: "center",
      show: false,
    },
    {
      label: "响应状态",
      prop: "response_status",
      width: 100,
      align: "center",
    },
    {
      label: "响应耗时",
      prop: "cost",
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
