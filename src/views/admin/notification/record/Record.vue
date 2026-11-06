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
      <template #channel="scope">
        <el-tag v-if="scope.row.channel === 'email'" type="success">邮件</el-tag>
        <el-tag v-else-if="scope.row.channel === 'sms'" type="warning">短信</el-tag>
        <el-tag v-else-if="scope.row.channel === 'push'" type="primary">推送</el-tag>
        <el-tag v-else type="info">{{ scope.row.channel }}</el-tag>
      </template>
      <template #status="scope">
        <el-tag v-if="scope.row.status === 'pending'" type="warning">待发送</el-tag>
        <el-tag v-else-if="scope.row.status === 'sent'" type="success">已发送</el-tag>
        <el-tag v-else-if="scope.row.status === 'failed'" type="danger">发送失败</el-tag>
        <el-tag v-else-if="scope.row.status === 'cancelled'" type="info">已取消</el-tag>
        <el-tag v-else type="info">{{ scope.row.status }}</el-tag>
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
import { DeliveryAPI } from "@/api";

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
 * 重发一条失败的投递。
 *
 * 已发送与已取消的记录不允许重发，服务端会拒绝；这里先让用户确认。
 */
function handleRedeliver(id: number) {
  ElMessageBox.confirm("确认重新投递该记录？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      DeliveryAPI.redeliverDelivery({ id })
        .then(() => {
          ElMessage.success("已加入重发队列");
          contentRef.value?.handleRefresh();
        })
        .catch(() => {});
    })
    .catch(() => {});
}
</script>
