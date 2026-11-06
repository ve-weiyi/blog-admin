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
      <template #event_type="scope">
        <el-tag v-if="scope.row.event_type === 1" type="success">登录</el-tag>
        <el-tag v-else type="info">登出</el-tag>
      </template>
      <template #logout_type="scope">
        <span>{{ scope.row.logout_type || "-" }}</span>
      </template>
      <template #login_type="scope">
        <el-tag v-if="scope.row.login_type === LoginTypeEnum.USERNAME" type="success">
          用户名
        </el-tag>
        <el-tag v-else-if="scope.row.login_type === LoginTypeEnum.EMAIL" type="danger">邮箱</el-tag>
        <el-tag v-else-if="scope.row.login_type === LoginTypeEnum.PHONE" type="danger">手机</el-tag>
        <el-tag v-else-if="scope.row.login_type === LoginTypeEnum.OAUTH" type="primary">
          第三方
        </el-tag>
        <el-tag v-else type="primary">{{ scope.row.login_type }}</el-tag>
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
import { LoginTypeEnum } from "@/enums/blog";

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
  console.log(name);
}

// 其他操作列
function handleOperateClick(data: IOperateData) {
  console.log(data);
}
</script>
