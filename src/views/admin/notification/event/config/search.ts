import type { ISearchConfig } from "@/components/CURD/types";

const searchConfig: ISearchConfig = {
  permPrefix: "notification:event",
  formItems: [
    {
      type: "select",
      label: "事件状态",
      prop: "status",
      attrs: {
        placeholder: "全部",
        clearable: true,
        style: {
          width: "150px",
        },
      },
      options: [
        { label: "待扇出", value: "pending" },
        { label: "扇出中", value: "fanning" },
        { label: "已完成", value: "done" },
        { label: "已失败", value: "failed" },
        { label: "已终止", value: "terminated" },
      ],
    },
    {
      type: "input",
      label: "场景",
      prop: "scene",
      attrs: {
        placeholder: "如 article.liked",
        clearable: true,
        style: {
          width: "200px",
        },
      },
    },
  ],
};

export default searchConfig;
