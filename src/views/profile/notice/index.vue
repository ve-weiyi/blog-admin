<template>
  <div class="app-container">
    <div class="filter-section">
      <el-form :model="queryParams" :inline="true">
        <el-form-item label="只看未读">
          <el-switch v-model="queryParams.onlyUnread" @change="handleQuery" />
        </el-form-item>

        <el-form-item class="search-buttons">
          <el-button type="primary" @click="handleQuery">
            <template #icon><Search /></template>
            刷新
          </el-button>
          <el-button @click="handleReadAll">全部已读</el-button>
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
            <el-badge v-if="scope.row.unread" is-dot />
            <el-tag v-else size="small" type="info">已读</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型" width="110">
          <template #default="scope">
            <el-tag :type="levelType(scope.row.level)" size="small">
              {{ sceneLabel(scope.row.scene) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="通知" prop="title" min-width="320">
          <template #default="scope">
            <div :style="{ fontWeight: scope.row.unread ? 'bold' : 'normal' }">
              {{ scope.row.title }}
            </div>
            <div v-if="scope.row.content" class="content">{{ scope.row.content }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间" width="170">
          <template #default="scope">
            {{ formatDateTime(scope.row.latest_at) }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="140">
          <template #default="scope">
            <el-button type="primary" size="small" link @click="handleRead(scope.row)">
              查看
            </el-button>
            <el-button type="danger" size="small" link @click="handleDelete(scope.row)">
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
      v-model="detailVisible"
      :title="detail?.title ?? '通知详情'"
      width="800px"
      custom-class="notice-detail"
    >
      <div v-if="detail" class="notice-detail__wrapper">
        <div class="notice-detail__meta">
          <el-icon><Timer /></el-icon>
          <span class="ml-1">{{ formatDateTime(detail.latest_at) }}</span>
        </div>

        <div class="notice-detail__content whitespace-pre-wrap">{{ detail.content }}</div>

        <div v-if="detail.link" class="notice-detail__actions">
          <el-link type="primary" underline="never" @click="openLink(detail.link)">
            查看详情
          </el-link>
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
import { MeNotificationAPI } from "@/api";
import type { NotificationGroupVO } from "@/api/types";
import { useNotificationStore } from "@/stores/notification";
import { formatDateTime } from "@/utils/format";

const pageData = ref<NotificationGroupVO[]>([]);
const loading = ref(false);
const total = ref(0);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  onlyUnread: false,
});

const detailVisible = ref(false);
const detail = ref<NotificationGroupVO | null>(null);

const sceneLabels: Record<string, string> = {
  announcement: "公告",
  "content.commented": "新评论",
  "comment.replied": "回复",
  "comment.liked": "评论获赞",
  "article.liked": "文章获赞",
  "talk.liked": "说说获赞",
  "content.reviewed": "审核",
  "account.security": "安全",
};

function sceneLabel(scene: string) {
  return sceneLabels[scene] ?? "通知";
}

function levelType(level: string) {
  switch (level) {
    case "warning":
      return "warning";
    case "error":
      return "danger";
    case "success":
      return "success";
    default:
      return "info";
  }
}

// 收件人取自登录态，请求里不带 user_id
function handleQuery() {
  loading.value = true;
  MeNotificationAPI.queryMeNotificationList({
    page: queryParams.pageNum,
    page_size: queryParams.pageSize,
    unread_only: queryParams.onlyUnread || undefined,
  })
    .then((res) => {
      total.value = res.data.total;
      pageData.value = (res.data.list || []) as NotificationGroupVO[];
      useNotificationStore().refreshUnread();
    })
    .finally(() => {
      loading.value = false;
    });
}

// 表格槽里的行是 Element 的 DefaultRow，取用时收敛成收件箱分组类型
function handleRead(raw: Record<string, any>) {
  const row = raw as NotificationGroupVO;
  detail.value = row;
  detailVisible.value = true;
  if (row.unread) {
    row.unread = false;
    useNotificationStore().markAsRead(row.group_key);
  }
}

function handleDelete(raw: Record<string, any>) {
  const row = raw as NotificationGroupVO;
  ElMessageBox.confirm("确认删除该通知？", "提示", { type: "warning" }).then(() => {
    MeNotificationAPI.deleteMeNotification({ group_key: row.group_key }).then(() => {
      ElMessage.success("删除成功");
      handleQuery();
    });
  });
}

function handleReadAll() {
  useNotificationStore()
    .markAllAsRead()
    .then(() => {
      ElMessage.success("已全部标记为已读");
      handleQuery();
    });
}

function openLink(link: string) {
  window.open(link, "_blank");
}

onMounted(() => {
  handleQuery();
});
</script>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
  text-align: center;
}

.content {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
    margin-bottom: 16px;
    overflow-y: auto;
    border-top: 1px solid var(--el-border-color);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
