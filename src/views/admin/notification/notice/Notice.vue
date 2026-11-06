<template>
  <div class="app-container">
    <!-- 搜索 -->
    <PageSearch
      ref="searchRef"
      :search-config="searchConfig"
      @query-click="handleQueryClick"
      @reset-click="handleResetClick"
    />

    <!-- 列表 -->
    <PageContent
      ref="contentRef"
      :content-config="contentConfig"
      @add-click="handleAddClick"
      @edit-click="handleEditClick"
      @search-click="handleSearchClick"
      @toolbar-click="handleToolbarClick"
      @operate-click="handleOperateClick"
      @filter-change="handleFilterChange"
    >
      <template #category="scope">
        <el-tag v-if="scope.row.category === NoticeTypeEnum.SYSTEM" type="primary">系统</el-tag>
        <el-tag v-else-if="scope.row.category === NoticeTypeEnum.MAINTENANCE" type="warning">
          维护
        </el-tag>
        <el-tag v-else-if="scope.row.category === NoticeTypeEnum.UPDATE" type="success">
          更新
        </el-tag>
        <el-tag v-else type="info">提醒</el-tag>
      </template>
      <template #level="scope">
        <el-tag v-if="scope.row.level === NoticeLevelEnum.INFO" type="info">普通</el-tag>
        <el-tag v-else-if="scope.row.level === NoticeLevelEnum.WARNING" type="warning">警告</el-tag>
        <el-tag v-else type="danger">紧急</el-tag>
      </template>
      <template #status="scope">
        <el-tag v-if="scope.row.status === NotifyStatusEnum.DRAFT" type="info">草稿</el-tag>
        <el-tag v-else-if="scope.row.status === NotifyStatusEnum.PUBLISHED" type="success">
          已发布
        </el-tag>
        <el-tag v-else-if="scope.row.status === NotifyStatusEnum.REVOKED" type="danger">
          已撤回
        </el-tag>
        <el-tag v-else type="info">未知</el-tag>
      </template>
    </PageContent>

    <!-- 新增 -->
    <PageModal ref="addModalRef" :modal-config="addModalConfig" @submit-click="handleSubmitClick" />

    <!-- 编辑 -->
    <PageModal
      ref="editModalRef"
      :modal-config="editModalConfig"
      @submit-click="handleSubmitClick"
    />
  </div>
</template>

<script setup lang="ts">
import type { IOperateData } from "@/components/CURD/types";
import usePage from "@/components/CURD/usePage";
import addModalConfig from "./config/add";
import contentConfig from "./config/content";
import editModalConfig from "./config/edit";
import searchConfig from "./config/search";
import PageSearch from "@/components/CURD/PageSearch.vue";
import PageModal from "@/components/CURD/PageModal.vue";
import PageContent from "@/components/CURD/PageContent.vue";
import { NoticeLevelEnum, NoticeTypeEnum, NotifyStatusEnum } from "@/enums/blog";
import { AnnouncementAPI } from "@/api";

const {
  searchRef,
  contentRef,
  addModalRef,
  editModalRef,
  handleQueryClick,
  handleResetClick,
  handleAddClick,
  handleEditClick,
  handleSubmitClick,
  handleSearchClick,
  handleFilterChange,
} = usePage();

function handleToolbarClick(name: string) {
  console.log(name);
}

function handleOperateClick(data: IOperateData) {
  switch (data.name) {
    case "edit":
      handleEditClick(data.row);
      break;
    case "publish":
      handlePublish(data.row.id);
      break;
    case "revoke":
      handleRevoke(data.row.id);
      break;
    default:
      console.log(data);
      break;
  }
}

function handlePublish(id: number) {
  ElMessageBox.confirm("确认发布该公告？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      AnnouncementAPI.publishAnnouncement({ id })
        .then(() => {
          ElMessage.success("发布成功");
          contentRef.value?.handleRefresh();
        })
        .catch(() => {});
    })
    .catch(() => {});
}

function handleRevoke(id: number) {
  ElMessageBox.confirm("确认撤回该公告？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      AnnouncementAPI.revokeAnnouncement({ id })
        .then(() => {
          ElMessage.success("撤回成功");
          contentRef.value?.handleRefresh();
        })
        .catch(() => {});
    })
    .catch(() => {});
}
</script>
