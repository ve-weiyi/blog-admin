import type { IContentConfig } from "@/components/CURD/types";
import type { QueryNotifyTemplateListReq } from "@/api/types";
import { NotifyTemplateAPI } from "@/api";

const contentConfig: IContentConfig<QueryNotifyTemplateListReq> = {
  pageTitle: "通知模板",
  permPrefix: "notification:template",
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
  indexAction(query: QueryNotifyTemplateListReq) {
    return NotifyTemplateAPI.queryNotifyTemplateList(query);
  },
  deleteAction(ids: string) {
    return NotifyTemplateAPI.batchDeleteNotifyTemplate({
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
      show: false,
    },
    {
      label: "模板编码",
      prop: "code",
      width: 140,
      align: "center",
    },
    {
      label: "渠道",
      prop: "channel",
      width: 100,
      align: "center",
      templet: "custom",
    },
    {
      label: "场景",
      prop: "scene",
      width: 120,
      align: "center",
    },
    {
      label: "标题",
      prop: "title",
      minWidth: 160,
      align: "left",
    },
    {
      label: "是否启用",
      prop: "enabled",
      width: 100,
      align: "center",
      templet: "custom",
    },
    {
      label: "创建时间",
      prop: "created_at",
      width: 170,
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
