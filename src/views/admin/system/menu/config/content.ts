import type { IContentConfig } from "@/components/CURD/types";
import type { QueryMenuListReq } from "@/api/types";
import { MenuAPI } from "@/api";

const contentConfig: IContentConfig<QueryMenuListReq> = {
  pageTitle: "菜单管理",
  permPrefix: "sys:menu",
  table: {
    border: true,
    highlightCurrentRow: true,
    treeProps: {
      children: "children",
      hasChildren: "hasChildren",
    },
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
  indexAction(params: QueryMenuListReq) {
    if (!params.sorts) {
      params.sorts = [`id desc`];
    }

    return MenuAPI.queryMenuList(params);
  },
  deleteAction(ids: string) {
    return MenuAPI.batchDeleteMenu({
      ids: ids.split(",").map((id) => parseInt(id)),
    });
  },
  pk: "id",
  toolbar: [
    {
      name: "sync",
      text: "同步菜单",
      perm: "sync",
      attrs: {
        icon: "refresh",
        type: "primary",
      },
    },
    {
      name: "clear",
      text: "清空菜单",
      perm: "clear",
      attrs: {
        icon: "delete",
        type: "info",
      },
    },
    {
      name: "catalog",
      text: "新增目录",
      perm: "catalog",
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
    // {
    //   label: "图标",
    //   prop: "icon",
    //   width: 80,
    //   align: "center",
    //   templet: "custom",
    // },
    {
      label: "菜单名称",
      prop: "title",
      width: 150,
      align: "left",
      templet: "custom",
    },
    {
      label: "类型",
      prop: "type",
      width: 100,
      align: "center",
      templet: "custom",
    },
    {
      label: "路由名称",
      prop: "name",
      width: 120,
      align: "center",
    },
    {
      label: "路由路径",
      prop: "path",
      width: 120,
      align: "center",
    },
    {
      label: "组件路径",
      prop: "component",
      width: 200,
      align: "center",
    },
    {
      label: "权限标识",
      prop: "perm",
      width: 100,
      align: "center",
    },
    {
      label: "排序",
      prop: "rank",
      width: 80,
      align: "center",
    },
    {
      label: "状态",
      prop: "visible",
      width: 100,
      align: "center",
      templet: "custom",
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
