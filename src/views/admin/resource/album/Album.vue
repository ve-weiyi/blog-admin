<template>
  <div class="app-container">
    <!-- 搜索卡片 -->
    <el-card v-show="showSearch" shadow="never" class="mb-[10px]">
      <el-form :inline="true">
        <el-form-item label="相册名称">
          <el-input
            v-model="queryParams.album_name"
            style="width: 200px"
            placeholder="请输入相册名称"
            clearable
            @keyup.enter="refreshList"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="refreshList">搜索</el-button>
          <el-button icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 主内容卡片 -->
    <el-card class="main-card">
      <div class="table-title">{{ route.meta.title }}</div>

      <!-- 操作按钮 -->
      <el-row :gutter="10" style="margin-bottom: 8px">
        <el-col :span="1.5">
          <el-button icon="Plus" size="default" type="primary" @click="handleAdd">
            新建相册
          </el-button>
        </el-col>
        <RightToolbar v-model:show-search="showSearch" @query-table="refreshList">
          <el-button
            icon="Delete"
            size="default"
            style="margin-right: 1rem"
            text
            type="primary"
            @click="routeToDelete"
          >
            回收站
          </el-button>
        </RightToolbar>
      </el-row>

      <!-- 空状态 -->
      <el-empty v-if="!albumList?.length" description="暂无相册" />

      <!-- 相册列表 -->
      <el-row v-loading="loading" :gutter="12" class="album-container">
        <el-col v-for="item in albumList" :key="item.id" :md="6">
          <div class="album-item" @click="routeToPhoto(item)">
            <!-- 相册操作 -->
            <div class="album-operation">
              <el-dropdown @command="(command) => handleCommand(command, item)">
                <el-icon style="color: #fff; cursor: pointer">
                  <MoreFilled />
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="edit" icon="Edit">编辑</el-dropdown-item>
                    <el-dropdown-item command="delete" icon="Delete">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <div class="album-photo-count">
              <div>{{ item.photo_count }}</div>
              <el-icon v-if="item.status === ArticleStatusEnum.PRIVATE">
                <Lock />
              </el-icon>
            </div>

            <el-image :src="item.album_cover" class="album-cover" fit="cover" />
            <div class="album-name">{{ item.album_name }}</div>
          </div>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.page_size"
        class="pagination-container"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
        hide-on-single-page
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 新增/编辑模态框 -->
    <el-dialog v-model="modalVisible" :title="dialogTitle" width="35%">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" size="default">
        <el-form-item label="相册名称" prop="album_name">
          <el-input v-model="formData.album_name" />
        </el-form-item>
        <el-form-item label="相册描述" prop="album_desc">
          <el-input v-model="formData.album_desc" />
        </el-form-item>
        <el-form-item label="相册封面" prop="album_cover">
          <el-radio-group v-model="uploadType">
            <el-radio value="upload">上传文件</el-radio>
            <el-radio value="select">选择文件</el-radio>
            <el-radio value="input">填写链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <OptionImageUpload
          v-model="formData.album_cover"
          :upload-type="uploadType"
          upload-path="blog/album/"
        />
        <el-form-item label="发布形式" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="ArticleStatusEnum.PUBLIC">公开</el-radio>
            <el-radio :value="ArticleStatusEnum.PRIVATE">私密</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="modalVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import RightToolbar from "@/components/RightToolbar/index.vue";
import "@/styles/table.scss";
import { AlbumAPI } from "@/api";
import type { AlbumVO, UpdateAlbumReq, QueryAlbumListReq } from "@/api/types";
import OptionImageUpload from "@/components/Upload/OptionImageUpload.vue";
import { ArticleStatusEnum, SwitchEnum } from "@/enums/blog";

// 响应式数据
const loading = ref(false);
const showSearch = ref(false);
const queryParams = ref<QueryAlbumListReq>({
  page: 1,
  page_size: 10,
  is_delete: SwitchEnum.OFF,
});
const albumList = ref<AlbumVO[]>([]);
const count = ref(0);

// 表单相关
const modalVisible = ref(false);
const formRef = ref<FormInstance>();
const uploadType = ref("upload");

const initFormData: UpdateAlbumReq = {
  id: 0,
  album_name: "",
  album_desc: "",
  album_cover: "",
  status: ArticleStatusEnum.PUBLIC,
};

const formData = ref<UpdateAlbumReq>({ ...initFormData });

const formRules: FormRules<UpdateAlbumReq> = {
  album_name: [{ required: true, message: "请输入相册名称", trigger: "blur" }],
  album_desc: [{ required: true, message: "请输入相册描述", trigger: "blur" }],
  album_cover: [{ required: true, message: "请上传相册封面", trigger: "blur" }],
  status: [{ required: true, message: "请选择发布形式", trigger: "change" }],
};

// 计算属性
const dialogTitle = computed(() => (formData.value.id === 0 ? "添加相册" : "编辑相册"));

// 路由
const route = useRoute();
const router = useRouter();

// 分页处理
const handleSizeChange = (size: number) => {
  queryParams.value.page_size = size;
  refreshList();
};

const handleCurrentChange = (current: number) => {
  queryParams.value.page = current;
  refreshList();
};

// 列表操作
const refreshList = async () => {
  loading.value = true;
  try {
    const res = await AlbumAPI.queryAlbumList(queryParams.value);
    albumList.value = res.data.list;
    count.value = res.data.total;
  } finally {
    loading.value = false;
  }
};

const resetSearch = () => {
  queryParams.value = {
    page: 1,
    page_size: 10,
    is_delete: SwitchEnum.OFF,
  };
  refreshList();
};

// 表单操作
const handleAdd = () => {
  Object.assign(formData.value, initFormData);
  modalVisible.value = true;
};

const handleEdit = (data: AlbumVO) => {
  Object.assign(formData.value, data);
  modalVisible.value = true;
};

const handleDelete = async (data: AlbumVO) => {
  try {
    await ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await AlbumAPI.batchDeleteAlbum({
      ids: [data.id!],
    });

    ElMessage.success("删除成功");
    refreshList();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error("删除失败: " + error.message);
    }
  }
};

const handleCommand = (command: string, item: AlbumVO) => {
  if (command === "edit") {
    handleEdit(item);
  } else if (command === "delete") {
    handleDelete(item);
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    const data = { ...formData.value };
    if (data.id === 0) {
      await AlbumAPI.createAlbum(data as any);
      ElMessage.success("创建成功");
    } else {
      await AlbumAPI.updateAlbum(data);
      ElMessage.success("编辑成功");
    }

    modalVisible.value = false;
    refreshList();
  } catch {
    // 错误已由API处理
  }
};

// 路由跳转
const routeToPhoto = (item: AlbumVO) => {
  router.push({ path: "/resource/albums/" + item.id });
};

const routeToDelete = () => {
  router.push({ path: "/resource/photo/delete" });
};

// 初始化
onMounted(() => {
  refreshList();
});
</script>

<style scoped>
.album-cover {
  position: relative;
  width: 100%;
  height: 11rem;
  border-radius: 4px;
}

.album-cover::before {
  position: absolute;
  inset: 0;
  content: "";
  background: rgb(0 0 0 / 20%);
}

.album-photo-count {
  position: absolute;
  right: 0;
  bottom: 2.6rem;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem;
  font-size: 1.5rem;
  color: #fff;
}

.album-name {
  margin-top: 0.5rem;
  text-align: center;
}

.album-item {
  position: relative;
  margin-bottom: 1rem;
  cursor: pointer;
}

.album-operation {
  position: absolute;
  top: 0.5rem;
  right: 0.8rem;
  z-index: 1000;
}
</style>
