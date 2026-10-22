import type { IContentConfig } from "@/components/CURD/types";
import type { QueryArticleListReq } from "@/api/types";
import { ArticleAPI } from "@/api";
import { ArticleDeleteEnum, ArticleTopEnum } from "@/enums/blog";

const contentConfig: IContentConfig<QueryArticleListReq> = {
  pageTitle: "文章管理",
  permPrefix: "blog:article",
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
  indexAction(query: QueryArticleListReq) {
    return ArticleAPI.queryArticleList(query);
  },
  modifyAction(data) {
    return ArticleAPI.patchArticle(data);
  },
  pk: "id",
  toolbar: [
    {
      name: "write",
      text: "新增文章",
      perm: "write",
      attrs: {
        icon: "plus",
        type: "primary",
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
      label: "文章封面",
      prop: "article_cover",
      width: 100,
      align: "center",
      templet: "image",
      imageWidth: 80,
    },
    {
      label: "文章标题",
      prop: "article_title",
      minWidth: 200,
      width: 0,
      align: "center",
    },
    {
      label: "文章类型",
      prop: "article_type",
      width: 100,
      align: "center",
      templet: "custom",
    },
    {
      label: "分类",
      prop: "category_name",
      width: 100,
      align: "center",
      templet: "custom",
    },
    {
      label: "标签",
      prop: "tag_name_list",
      width: 120,
      align: "center",
      templet: "custom",
    },
    {
      label: "是否置顶",
      prop: "is_top",
      width: 100,
      align: "center",
      templet: "switch",
      activeValue: ArticleTopEnum.YES,
      inactiveValue: ArticleTopEnum.NO,
    },
    {
      label: "浏览量",
      prop: "view_count",
      width: 80,
      align: "center",
    },
    {
      label: "点赞量",
      prop: "like_count",
      width: 80,
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
          name: "edit",
          text: "编辑",
          perm: "edit",
          attrs: {
            icon: "edit",
            type: "primary",
          },
          render(row) {
            return row.is_delete !== ArticleDeleteEnum.YES;
          },
        },
        {
          name: "delete",
          text: "删除",
          perm: "delete",
          attrs: {
            icon: "refresh",
            type: "danger",
          },
          render(row) {
            return row.is_delete !== ArticleDeleteEnum.YES;
          },
        },
        {
          name: "restore",
          text: "恢复",
          perm: "restore",
          attrs: {
            icon: "refreshLeft",
            type: "success",
          },
          render(row) {
            return row.is_delete === ArticleDeleteEnum.YES;
          },
        },
        {
          name: "destroy",
          text: "销毁",
          perm: "destroy",
          attrs: {
            icon: "delete",
            type: "info",
          },
          render(row) {
            return row.is_delete === ArticleDeleteEnum.YES;
          },
        },
      ],
    },
  ],
};

export default contentConfig;
