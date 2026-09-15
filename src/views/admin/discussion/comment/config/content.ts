import type { IContentConfig } from "@/components/CURD/types";
import type { QueryCommentListReq } from "@/api/types";
import { CommentAPI } from "@/api";

const contentConfig: IContentConfig<QueryCommentListReq> = {
  pageTitle: "评论管理",
  permPrefix: "news:comment",
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
  indexAction(query: QueryCommentListReq) {
    return CommentAPI.queryCommentList(query);
  },
  deleteAction(ids: string) {
    return CommentAPI.batchDeleteComment({
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
      label: "评论人",
      prop: "user_info",
      width: 150,
      align: "center",
      templet: "custom",
    },
    {
      label: "游客信息",
      prop: "guest_info",
      width: 150,
      align: "center",
      templet: "custom",
    },
    {
      label: "回复人",
      prop: "reply_user",
      width: 150,
      align: "center",
      templet: "custom",
    },
    {
      label: "文章标题",
      prop: "topic_title",
      width: 160,
      align: "center",
    },
    {
      label: "评论内容",
      prop: "comment_content",
      minWidth: 200,
      width: 0,
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
      label: "类型",
      prop: "type",
      align: "center",
      width: 80,
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
