import type { IContentConfig } from "@/components/CURD/types";
import type { QueryRoleListReq } from "@/api/types";
import { RoleAPI } from "@/api";
import { RoleDefaultEnum } from "@/enums/blog";

const contentConfig: IContentConfig<QueryRoleListReq> = {
  pageTitle: "角色管理",
  permPrefix: "sys:role",
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
  indexAction(params: QueryRoleListReq) {
    return RoleAPI.queryRoleList(params);
  },
  deleteAction(ids: string) {
    return RoleAPI.batchDeleteRole({
      ids: ids.split(",").map((id) => parseInt(id)),
    });
  },
  modifyAction(data) {
    return RoleAPI.updateRole(data);
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
      label: "角色标识",
      prop: "role_key",
      width: 120,
      align: "center",
    },
    {
      label: "角色标签",
      prop: "role_label",
      width: 120,
      align: "center",
    },
    {
      label: "角色备注",
      prop: "role_comment",
      width: 0,
      minWidth: 220,
      align: "center",
    },
    {
      label: "是否默认角色",
      prop: "is_default",
      width: 120,
      align: "center",
      templet: "switch",
      activeValue: RoleDefaultEnum.YES,
      inactiveValue: RoleDefaultEnum.NO,
      activeText: "默认",
      inactiveText: "非默认",
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
          name: "perm",
          text: "分配权限",
          perm: "perm",
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
