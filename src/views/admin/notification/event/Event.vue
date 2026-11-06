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
      <template #object_type="scope">
        <span v-if="scope.row.object_type">
          {{ scope.row.object_type }}#{{ scope.row.object_id }}
        </span>
        <span v-else class="text-gray-400">-</span>
      </template>
      <template #status="scope">
        <el-tag v-if="scope.row.status === 'pending'" type="info">待扇出</el-tag>
        <el-tag v-else-if="scope.row.status === 'fanning'" type="warning">扇出中</el-tag>
        <el-tag v-else-if="scope.row.status === 'done'" type="success">已完成</el-tag>
        <el-tag v-else-if="scope.row.status === 'failed'" type="danger">已失败</el-tag>
        <el-tag v-else-if="scope.row.status === 'terminated'" type="info">已终止</el-tag>
        <el-tag v-else type="info">{{ scope.row.status }}</el-tag>
      </template>
      <template #processed="scope">
        <span>
          {{ scope.row.processed }} / {{ scope.row.audience_total }}
        </span>
      </template>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import type { IOperateData } from "@/components/CURD/types";
import usePage from "@/components/CURD/usePage";
import contentConfig from "./config/content";
import searchConfig from "./config/search";
import PageSearch from "@/components/CURD/PageSearch.vue";
import PageContent from "@/components/CURD/PageContent.vue";
import { NotificationEventAPI } from "@/api";

const {
  searchRef,
  contentRef,
  handleQueryClick,
  handleResetClick,
  handleSearchClick,
  handleFilterChange,
} = usePage();

function handleToolbarClick(name: string) {
  console.log(name);
}

function handleOperateClick(data: IOperateData) {
  if (data.name === "redeliver") {
    handleRedeliver(data.row.id as number);
    return;
  }
  console.log(data);
}

/**
 * 重新扇出：只接受失败或停滞的事件。
 * 已完成的事件重放会从头扫描受众，期间新注册的用户会收到一条旧通知，服务端会拒绝。
 */
function handleRedeliver(id: number) {
  ElMessageBox.confirm("确认重新扇出该事件？已完成的事件不允许重放。", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      NotificationEventAPI.redeliverEvent({ id })
        .then(() => {
          ElMessage.success("已重新入队");
          contentRef.value?.handleRefresh();
        })
        .catch(() => {});
    })
    .catch(() => {});
}
</script>
