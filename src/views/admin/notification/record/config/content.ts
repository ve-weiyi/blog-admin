import type { IContentConfig } from "@/components/CURD/types";
import type { QueryDeliveryListReq } from "@/api/types";
import { DeliveryAPI } from "@/api";

const contentConfig: IContentConfig<QueryDeliveryListReq> = {
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
  indexAction(query: QueryDeliveryListReq) {
    return DeliveryAPI.queryDeliveryList(query);
  },
  deleteAction(ids: string) {
    return DeliveryAPI.batchDeleteDelivery({
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
      // 站内信的「投递」就是条目本身，这里只出现外部渠道
      label: "条目ID",
      prop: "notification_id",
      width: 90,
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
      width: 220,
      align: "center",
    },
    {
      label: "状态",
      prop: "status",
      width: 100,
      align: "center",
      templet: "custom",
    },
    {
      label: "尝试次数",
      prop: "attempts",
      width: 90,
      align: "center",
    },
    {
      label: "下次重试",
      prop: "next_retry_at",
      width: 170,
      align: "center",
      templet: "date",
      dateFormat: "YYYY/MM/DD HH:mm:ss",
    },
    {
      label: "错误信息",
      prop: "error_msg",
      minWidth: 200,
      width: 0,
      align: "center",
      show: false,
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
      label: "厂商回执",
      prop: "provider_msg_id",
      width: 160,
      align: "center",
      show: false,
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
      width: 150,
      templet: "tool",
      operat: [
        {
          name: "redeliver",
          text: "重发",
          perm: "edit",
          attrs: {
            icon: "refresh",
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
