import type { IContentConfig } from "@/components/CURD/types";
import type { QueryApiListReq } from "@/api/types";
import { ApiAPI } from "@/api";
import { ApiTraceableEnum } from "@/enums/blog";

const contentConfig: IContentConfig<QueryApiListReq> = {
  pageTitle: "接口管理",
  permPrefix: "sys:api",
  table: {
    border: true,
    highlightCurrentRow: true,
    treeProps: {
      children: "children",
      hasChildren: "hasChildren",
    },
    defaultExpandAll: false, // 默认全部展开
  },
  pagination: {
    background: true,
    layout: "prev,pager,next,jumper,total,sizes",
    pageSize: 10,
    pageSizes: [10, 20, 30, 50],
  },
  parseData: (res) => {
    return {
      total: -1,
      list: res.data.list || [],
    };
  },
  indexAction(params: QueryApiListReq) {
    return ApiAPI.queryApiList(params);
  },
  deleteAction(ids: string) {
    return ApiAPI.batchDeleteApi({
      ids: ids.split(",").map((id) => parseInt(id)),
    });
  },
  modifyAction(data) {
    return ApiAPI.updateApi(data);
  },
  pk: "id",
  toolbar: [
    {
      name: "sync",
      text: "同步接口",
      perm: "sync",
      attrs: {
        icon: "refresh",
        type: "primary",
      },
    },
    {
      name: "clear",
      text: "清空接口",
      perm: "clear",
      attrs: {
        icon: "delete",
        type: "info",
      },
    },
    {
      name: "module",
      text: "新增模块",
      perm: "module",
      attrs: {
        icon: "plus",
        type: "warning",
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
      show: false,
    },
    {
      label: "接口名称",
      prop: "name",
      minWidth: 140,
      align: "left",
    },
    {
      label: "接口路径",
      prop: "path",
      minWidth: 150,
      align: "center",
    },
    {
      label: "请求方法",
      prop: "method",
      width: 100,
      align: "center",
      templet: "custom",
    },
    {
      label: "是否记录日志",
      prop: "traceable",
      width: 120,
      align: "center",
      templet: "switch",
      activeValue: ApiTraceableEnum.YES,
      inactiveValue: ApiTraceableEnum.NO,
      activeText: "记录",
      inactiveText: "不记录",
    },
    {
      label: "状态",
      prop: "status",
      width: 100,
      align: "center",
      templet: "custom",
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
          name: "add",
          text: "新增",
          perm: "add",
          attrs: {
            icon: "plus",
            type: "success",
          },
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
