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
      @search-click="handleSearchClick"
      @toolbar-click="handleToolbarClick"
      @operate-click="handleOperateClick"
      @filter-change="handleFilterChange"
    >
      <template #user_info="scope">
        <UserInfo :user="scope.row.user_info" />
      </template>
      <template #guest_info="scope">
        <GuestInfo :guest="scope.row.guest_info" />
      </template>
      <template #reply_user_info="scope">
        <div v-if="scope.row.reply_user_info" style="display: flex; gap: 8px; align-items: center">
          <el-image
            :src="scope.row.reply_user_info.avatar"
            :preview-teleported="true"
            style="width: 40px; height: 40px"
          />
          <span style="line-height: 1">{{ scope.row.reply_user_info.nickname }}</span>
        </div>
      </template>
      <template #status="scope">
        <el-tag v-if="scope.row.status === CommentStatusEnum.NORMAL" type="success">正常</el-tag>
        <el-tag v-else-if="scope.row.status === CommentStatusEnum.EDITED" type="primary">
          已编辑
        </el-tag>
        <el-tag v-else-if="scope.row.status === CommentStatusEnum.DELETED" type="danger">
          已删除
        </el-tag>
      </template>
      <template #type="scope">
        <el-tag v-if="scope.row.type === CommentTypeEnum.ARTICLE" type="success">文章</el-tag>
        <el-tag v-else-if="scope.row.type === CommentTypeEnum.FRIEND" type="warning">友链</el-tag>
        <el-tag v-else-if="scope.row.type === CommentTypeEnum.TALK" type="danger">说说</el-tag>
        <el-tag v-else type="info">其他</el-tag>
      </template>
      <template #is_review="scope">
        <el-tag v-if="scope.row.is_review === CommentReviewEnum.APPROVED" type="success">
          已通过
        </el-tag>
        <el-tag v-else type="warning">待审核</el-tag>
      </template>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import type { IOperateData } from "@/components/CURD/types";
import usePage from "@/components/CURD/usePage";
import contentConfig from "./config/content";
import searchConfig from "./config/search";
import PageSearch from "@/components/CURD/PageSearch.vue";
import PageContent from "@/components/CURD/PageContent.vue";
import UserInfo from "@/components/UserInfo/index.vue";
import GuestInfo from "@/components/GuestInfo/index.vue";
import { ElMessage } from "element-plus";
import { CommentAPI } from "@/api";
import { CommentReviewEnum, CommentStatusEnum, CommentTypeEnum } from "@/enums/blog";

const {
  searchRef,
  contentRef,
  handleQueryClick,
  handleResetClick,
  handleSearchClick,
  handleFilterChange,
} = usePage();

// 其他工具栏
function handleToolbarClick(name: string) {
  if (name !== "approve" && name !== "reject") {
    return;
  }

  const rows = contentRef.value?.getSelectionData() ?? [];
  if (rows.length === 0) {
    ElMessage.warning("请选择评论");
    return;
  }

  reviewComments(
    rows.map((row) => row.id),
    name === "approve" ? CommentReviewEnum.APPROVED : CommentReviewEnum.PENDING
  );
}

// 其他操作列
function handleOperateClick(data: IOperateData) {
  if (data.name !== "approve" && data.name !== "reject") {
    return;
  }

  reviewComments(
    [data.row.id],
    data.name === "approve" ? CommentReviewEnum.APPROVED : CommentReviewEnum.PENDING
  );
}

function reviewComments(ids: number[], isReview: CommentReviewEnum) {
  CommentAPI.batchReviewComments({ ids, is_review: isReview }).then(() => {
    ElMessage.success("审核完成");
    contentRef.value?.fetchPageData();
  });
}
</script>
