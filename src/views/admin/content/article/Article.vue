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
      <template #table-header>
        <!-- 表格菜单 -->
        <div v-if="statusList.length !== 0" class="status-menu">
          <span>状态</span>
          <template v-for="item of statusList" :key="item.value">
            <span :class="isActive(item.value)" @click="handleStatusCheck(item.value)">
              {{ item.label }}
            </span>
          </template>
        </div>
      </template>
      <template #article_type="scope">
        <el-tag v-if="scope.row.article_type === ArticleTypeEnum.ORIGINAL" type="success">
          原创
        </el-tag>
        <el-tag v-if="scope.row.article_type === ArticleTypeEnum.REPRINT" type="warning">
          转载
        </el-tag>
        <el-tag v-if="scope.row.article_type === ArticleTypeEnum.TRANSLATE" type="info">
          翻译
        </el-tag>
      </template>
      <template #category_name="scope">
        <el-tag type="success">
          {{ scope.row.category_name }}
        </el-tag>
      </template>
      <template #tag_name_list="scope">
        <el-tag v-for="item of scope.row.tag_name_list" type="primary">
          {{ item }}
        </el-tag>
      </template>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { IOperateData } from "@/components/CURD/types";
import usePage from "@/components/CURD/usePage";
import contentConfig from "./config/content";
import searchConfig from "./config/search";
import PageSearch from "@/components/CURD/PageSearch.vue";
import PageContent from "@/components/CURD/PageContent.vue";
import { ArticleAPI } from "@/api";
import "@/styles/table.scss";
import { ArticleDeleteEnum, ArticleStatusEnum, ArticleTypeEnum } from "@/enums/blog";

const router = useRouter();

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
  switch (name) {
    case "write":
      router.push({ path: `/article/publish` });
  }
}

// 其他操作列
function handleOperateClick(data: IOperateData) {
  switch (data.name) {
    case "edit":
      router.push({ path: `/article/edit/${data.row.id}` });
      break;
    case "delete":
      ArticleAPI.patchArticle({
        id: data.row.id,
        is_delete: ArticleDeleteEnum.YES,
      }).then(() => {
        data.row.is_delete = ArticleDeleteEnum.YES;
        ElMessage.success("删除成功");
      });
      break;
    case "restore":
      ArticleAPI.patchArticle({
        id: data.row.id,
        is_delete: ArticleDeleteEnum.NO,
      }).then(() => {
        data.row.is_delete = ArticleDeleteEnum.NO;
        ElMessage.success("恢复成功");
      });
      break;
    case "destroy":
      ArticleAPI.deleteArticle({
        id: data.row.id,
      }).then(() => {
        ElMessage.success("销毁成功");
      });
      break;
    default:
      break;
  }
}

/** ******** start status menu **********/
type StatusTag = {
  value: string | number;
  label: string;
  condition: any;
};

const statusList: StatusTag[] = [
  {
    value: "all",
    label: "全部",
    condition: {},
  },
  {
    value: "public",
    label: "公开",
    condition: {
      is_delete: ArticleDeleteEnum.NO,
      status: ArticleStatusEnum.PUBLIC,
    },
  },
  {
    value: "private",
    label: "私密",
    condition: {
      is_delete: ArticleDeleteEnum.NO,
      status: ArticleStatusEnum.PRIVATE,
    },
  },
  {
    value: "draft",
    label: "草稿",
    condition: {
      is_delete: ArticleDeleteEnum.NO,
      status: ArticleStatusEnum.DRAFT,
    },
  },
  {
    value: "delete",
    label: "回收站",
    condition: {
      is_delete: ArticleDeleteEnum.YES,
    },
  },
];

const status = ref<string | number>(statusList.length > 0 ? statusList[0].value : 0);

const isActive = (value: string | number) => {
  return value === status.value ? "status-menu-active" : "status-menu-normal";
};
// 选择了状态
const handleStatusCheck = (value: string | number) => {
  status.value = value;
  const conditions = statusList.find((v) => v.value === status.value)?.condition || {};

  handleQueryClick(conditions);
};
</script>
