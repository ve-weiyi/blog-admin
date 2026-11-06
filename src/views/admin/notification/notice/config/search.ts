import type { ISearchConfig } from "@/components/CURD/types";
import {
  NoticeLevelEnum,
  NoticeTypeEnum,
  NotifyStatusEnum,
  NotifyTargetTypeEnum,
} from "@/enums/blog";

const searchConfig: ISearchConfig = {
  permPrefix: "website:notice",
  formItems: [
    {
      type: "select",
      label: "公告分类",
      prop: "category",
      attrs: {
        placeholder: "全部",
        clearable: true,
        style: {
          width: "150px",
        },
      },
      options: [
        { label: "系统公告", value: NoticeTypeEnum.SYSTEM },
        { label: "维护公告", value: NoticeTypeEnum.MAINTENANCE },
        { label: "功能更新", value: NoticeTypeEnum.UPDATE },
        { label: "重要提醒", value: NoticeTypeEnum.REMIND },
      ],
    },
    {
      type: "select",
      label: "公告等级",
      prop: "level",
      attrs: {
        placeholder: "全部",
        clearable: true,
        style: {
          width: "150px",
        },
      },
      options: [
        { label: "普通", value: NoticeLevelEnum.INFO },
        { label: "警告", value: NoticeLevelEnum.WARNING },
        { label: "紧急", value: NoticeLevelEnum.ERROR },
      ],
    },
    {
      type: "select",
      label: "目标范围",
      prop: "target_type",
      attrs: {
        placeholder: "全部",
        clearable: true,
        style: {
          width: "150px",
        },
      },
      options: [
        { label: "全部用户", value: NotifyTargetTypeEnum.ALL },
        { label: "指定用户", value: NotifyTargetTypeEnum.USER_IDS },
      ],
    },
    {
      type: "select",
      label: "发布状态",
      prop: "status",
      attrs: {
        placeholder: "全部",
        clearable: true,
        style: {
          width: "150px",
        },
      },
      initialValue: null,
      options: [
        { label: "草稿", value: NotifyStatusEnum.DRAFT },
        { label: "已发布", value: NotifyStatusEnum.PUBLISHED },
        { label: "已撤回", value: NotifyStatusEnum.REVOKED },
      ],
    },
  ],
};

export default searchConfig;
