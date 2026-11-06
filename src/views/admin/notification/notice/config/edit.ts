import type { IModalConfig } from "@/components/CURD/types";
import type { UpdateAnnouncementReq } from "@/api/types";
import { AnnouncementAPI } from "@/api";
import { NoticeLevelEnum, NoticeTypeEnum, NotifyTargetTypeEnum } from "@/enums/blog";

const modalConfig: IModalConfig<UpdateAnnouncementReq> = {
  permPrefix: "website:notice",
  component: "dialog",
  dialog: {
    title: "编辑公告",
    width: 600,
    draggable: true,
  },
  pk: "id",
  formAction(data) {
    return AnnouncementAPI.updateAnnouncement(data);
  },
  beforeSubmit(data) {
    console.log("提交之前处理", data);
  },
  formItems: [
    {
      label: "公告标题",
      prop: "title",
      rules: [{ required: true, message: "公告标题不能为空", trigger: "blur" }],
      type: "input",
      attrs: {
        type: "textarea",
        rows: 2,
        placeholder: "请输入公告标题",
      },
    },
    {
      label: "公告内容",
      prop: "content",
      rules: [{ required: true, message: "公告内容不能为空", trigger: "blur" }],
      type: "input",
      attrs: {
        type: "textarea",
        rows: 6,
        placeholder: "请输入公告内容",
      },
    },
    {
      label: "公告分类",
      prop: "category",
      rules: [{ required: true, message: "请选择公告分类", trigger: "change" }],
      type: "select",
      attrs: {
        placeholder: "请选择公告分类",
      },
      options: [
        { label: "系统公告", value: NoticeTypeEnum.SYSTEM },
        { label: "维护公告", value: NoticeTypeEnum.MAINTENANCE },
        { label: "功能更新", value: NoticeTypeEnum.UPDATE },
        { label: "重要提醒", value: NoticeTypeEnum.REMIND },
      ],
    },
    {
      label: "公告等级",
      prop: "level",
      rules: [{ required: true, message: "请选择公告等级", trigger: "change" }],
      type: "select",
      attrs: {
        placeholder: "请选择公告等级",
      },
      options: [
        { label: "普通", value: NoticeLevelEnum.INFO },
        { label: "警告", value: NoticeLevelEnum.WARNING },
        { label: "紧急", value: NoticeLevelEnum.ERROR },
      ],
    },
    {
      label: "目标范围",
      prop: "target_type",
      type: "select",
      attrs: {
        placeholder: "请选择目标范围",
      },
      options: [
        { label: "全部用户", value: NotifyTargetTypeEnum.ALL },
        { label: "指定用户", value: NotifyTargetTypeEnum.USER_IDS },
      ],
    },
  ],
};

export default modalConfig;
