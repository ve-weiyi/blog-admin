<template>
  <el-dropdown class="notice__dropdown" trigger="click">
    <div class="notice__trigger">
      <el-badge v-if="unreadTotal > 0" :value="unreadTotal" :max="99">
        <div class="i-svg:bell" />
      </el-badge>

      <div v-else class="i-svg:bell" />
    </div>

    <template #dropdown>
      <div class="p-5">
        <template v-if="list.length > 0">
          <div v-for="item in list" :key="item.group_key" class="w-500px py-3">
            <div class="flex-y-center">
              <el-badge v-if="item.unread" is-dot class="!mr-1" />
              <span v-else class="w-8px mr-1" />
              <el-tag :type="levelType(item.level)" size="small">{{ sceneLabel(item.scene) }}</el-tag>
              <el-text
                size="small"
                class="w-200px cursor-pointer !ml-2 !flex-1"
                truncated
                @click="read(item)"
              >
                {{ item.title }}
              </el-text>

              <div class="text-xs text-gray">
                {{ formatDateTime(item.latest_at) }}
              </div>
            </div>
          </div>
          <el-divider />
          <div class="flex-x-between">
            <el-link type="primary" underline="never" @click="goMore">
              <span class="text-xs">查看更多</span>
              <el-icon class="text-xs"><ArrowRight /></el-icon>
            </el-link>
            <el-link v-if="list.length > 0" type="primary" underline="never" @click="readAll">
              <span class="text-xs">全部已读</span>
            </el-link>
          </div>
        </template>
        <template v-else>
          <div class="flex-center h-150px w-350px">
            <el-empty :image-size="50" description="暂无消息" />
          </div>
        </template>
      </div>
    </template>
  </el-dropdown>

  <el-dialog
    v-model="dialogVisible"
    :title="detail?.title ?? '通知详情'"
    width="800px"
    custom-class="notification-detail"
  >
    <div v-if="detail" class="p-x-20px">
      <div class="flex-y-center mb-16px text-13px text-color-secondary">
        <span class="flex-y-center">
          <el-icon><Timer /></el-icon>
          {{ formatDateTime(detail.latest_at) }}
        </span>
      </div>

      <div class="max-h-60vh pt-16px mb-24px overflow-y-auto border-t border-solid border-color">
        <div class="whitespace-pre-wrap">{{ detail.content }}</div>
      </div>

      <div v-if="detail.link" class="flex-x-end">
        <el-link type="primary" underline="never" @click="openLink(detail.link)">查看详情</el-link>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { formatDateTime } from "@/utils/format";
import { useNotice } from "./useNotice";

const { list, unreadTotal, detail, dialogVisible, read, readAll, goMore } = useNotice();

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

/** 跳转地址由服务端渲染，客户端只负责打开 */
function openLink(link: string) {
  window.open(link, "_blank");
}
</script>

<style lang="scss" scoped>
.notice {
  &__dropdown {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
