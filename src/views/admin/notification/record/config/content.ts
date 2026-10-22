import type { IContentConfig } from "@/components/CURD/types";
import type { QueryNotifyRecordListReq } from "@/api/types";
import { NotifyRecordAPI } from "@/api";

const contentConfig: IContentConfig<QueryNotifyRecordListReq> = {
  pageTitle: "投递记录",
  permPrefix: "notification:delivery",
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
  indexAction(query: QueryNotifyRecordListReq) {
    return NotifyRecordAPI.queryNotifyRecordList(query);
  },
  deleteAction(ids: string) {
    return NotifyRecordAPI.batchDeleteNotifyRecord({
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
      label: "消息ID",
      prop: "message_id",
      width: 80,
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
      label: "接收者",
      prop: "recipient",
      width: 200,
      align: "center",
    },
    {
      label: "模板编码",
      prop: "template_code",
      width: 150,
      align: "center",
      show: false,
    },
    {
      label: "内容",
      prop: "content",
      minWidth: 200,
      width: 0,
      align: "center",
      show: false,
    },
    {
      label: "状态",
      prop: "status",
      width: 100,
      align: "center",
      templet: "custom",
    },
    {
      label: "业务ID",
      prop: "biz_id",
      width: 150,
      align: "center",
      show: false,
    },
    {
      label: "错误信息",
      prop: "error_msg",
      width: 200,
      align: "center",
      show: false,
    },
    {
      label: "阅读时间",
      prop: "read_at",
      width: 170,
      align: "center",
      sortable: true,
      templet: "date",
      dateFormat: "YYYY/MM/DD HH:mm:ss",
    },
    {
      label: "发送时间",
      prop: "sent_at",
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
      label: "操作栏",
      align: "center",
      fixed: "right",
      width: 100,
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
