<template>
  <div class="app-container">
    <div class="filter-section">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="通知标题" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="关键字"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <el-form-item class="search-buttons">
          <el-button type="primary" @click="handleQuery">
            <template #icon><Search /></template>
            搜索
          </el-button>
          <el-button @click="handleResetQuery">
            <template #icon><Refresh /></template>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="hover" class="table-section">
      <el-table
        ref="dataTableRef"
        v-loading="loading"
        :data="pageData"
        highlight-current-row
        class="table-section__content"
      >
        <el-table-column align="center" label="状态" width="80">
          <template #default="scope">
            <el-badge v-if="scope.row.status === 'unread'" is-dot />
            <el-tag v-else size="small" type="info">已读</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="通知标题" prop="title" min-width="200">
          <template #default="scope">
            <span :style="{ fontWeight: scope.row.status === 'unread' ? 'bold' : 'normal' }">
              {{ scope.row.title }}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="通知分类" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.category === 'system'" type="primary">系统</el-tag>
            <el-tag v-else-if="scope.row.category === 'maintenance'" type="warning">维护</el-tag>
            <el-tag v-else-if="scope.row.category === 'update'" type="success">更新</el-tag>
            <el-tag v-else type="info">提醒</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="通知等级" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.level === 'info'" type="info">普通</el-tag>
            <el-tag v-else-if="scope.row.level === 'warning'" type="warning">警告</el-tag>
            <el-tag v-else type="danger">紧急</el-tag>
          </template>
        </el-table-column>
        <el-table-column key="publishedAt" align="center" label="发布时间" width="150">
          <template #default="scope">
            {{ formatDateTime(scope.row.published_at) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布人" prop="published_by" width="150" />
        <el-table-column align="center" fixed="right" label="操作" width="140">
          <template #default="scope">
            <el-button type="primary" size="small" link @click="handleReadNotice(scope.row)">
              查看
            </el-button>
            <el-button type="danger" size="small" link @click="handleDeleteNotice(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
      />
    </el-card>

    <el-dialog
      v-model="noticeDialogVisible"
      :title="noticeDetail?.title ?? '通知详情'"
      width="800px"
      custom-class="notice-detail"
    >
      <div v-if="noticeDetail" class="notice-detail__wrapper">
        <div class="notice-detail__meta">
          <span>
            <el-icon><User /></el-icon>
            {{ noticeDetail.published_by }}
          </span>
          <span class="ml-2">
            <el-icon><Timer /></el-icon>
            {{ formatDateTime(noticeDetail.published_at) }}
          </span>
        </div>

        <div class="notice-detail__content">
          <div v-html="noticeDetail.content"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "MyNotice",
  inheritAttrs: false,
});

import { ElMessage, ElMessageBox } from "element-plus";
import { NotifyRecordAPI } from "@/api";
import { useUserStore } from "@/stores/user";
import { useNotificationStore } from "@/stores/notification";
import { formatDateTime } from "@/utils/format";

const queryFormRef = ref();
const pageData = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  title: "" as string,
});

const noticeDialogVisible = ref(false);
const noticeDetail = ref<any>(null);

function handleQuery() {
  const userStore = useUserStore();
  const userId = userStore.userInfo.user_id;
  if (!userId) return;

  loading.value = true;
  NotifyRecordAPI.queryUserInboxRecordList({
    page: queryParams.pageNum,
    page_size: queryParams.pageSize,
    user_id: userId,
    title: queryParams.title || undefined,
  })
    .then((res) => {
      total.value = res.data.total;
      useNotificationStore().unreadTotal = res.data.unread_total || 0;
      pageData.value = res.data.list || [];
    })
    .finally(() => {
      loading.value = false;
    });
}

function handleResetQuery() {
  queryFormRef.value?.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

function handleReadNotice(row: any) {
  noticeDetail.value = row;
  noticeDialogVisible.value = true;
  if (row.status === "unread") {
    row.status = "read";
    useNotificationStore().markAsRead(row.id);
  }
}

function handleDeleteNotice(row: any) {
  ElMessageBox.confirm("确认删除该通知？", "提示", { type: "warning" }).then(() => {
    NotifyRecordAPI.batchDeleteNotifyRecord({ ids: [row.id] }).then(() => {
      ElMessage.success("删除成功");
      handleQuery();
    });
  });
}

onMounted(() => {
  handleQuery();
});
</script>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
  text-align: center;
}

.notice-detail {
  &__wrapper {
    padding: 0 20px;
  }

  &__meta {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  &__content {
    max-height: 60vh;
    padding-top: 16px;
    margin-bottom: 24px;
    overflow-y: auto;
    border-top: 1px solid var(--el-border-color);

    &::-webkit-scrollbar {
      width: 6px;
    }
  }
}
</style>
