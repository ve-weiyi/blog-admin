<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-card v-show="showSearch" shadow="never" class="mb-[10px]">
      <el-form :inline="true">
        <el-form-item label="页面名称">
          <el-input
            v-model="queryParams.page_name"
            style="width: 200px"
            placeholder="请输入页面名称"
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
    <!-- 列表栏 -->
    <el-card class="main-card">
      <!-- 标题 -->
      <div class="table-title">{{ route.meta.title }}</div>
      <!-- 操作按钮 -->
      <el-row :gutter="10" style="margin-bottom: 8px">
        <el-col :span="1.5">
          <el-button icon="plus" size="default" type="primary" @click="handleAdd()">
            新建页面
          </el-button>
        </el-col>
        <RightToolbar v-model:show-search="showSearch" @query-table="refreshList" />
      </el-row>
      <!-- 空状态 -->
      <el-empty v-if="!pageList?.length" description="暂无页面" />
      <!-- 页面列表 -->
      <el-row v-loading="loading" :gutter="12" class="page-container">
        <el-col v-for="item in pageList" :key="item.id" :md="6">
          <div class="page-item" @click="handleEdit(item)">
            <!-- 页面操作 -->
            <div class="page-operation">
              <el-dropdown>
                <el-icon style="color: #fff; cursor: pointer">
                  <MoreFilled />
                </el-icon>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item icon="edit" @click="handleEdit(item)">编辑</el-dropdown-item>
                    <el-dropdown-item icon="delete" @click="handleDelete(item)">
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <el-image :src="item.page_cover" class="page-cover" fit="cover" />
            <div class="page-name">{{ item.page_name }}</div>
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
    <el-dialog v-model="modalVisible" top="10vh" width="35%">
      <template #header>
        <div class="dialog-title-container">
          {{ dialogTitle }}
        </div>
      </template>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" size="default">
        <el-form-item label="页面名称" prop="page_name">
          <el-input v-model="formData.page_name" />
        </el-form-item>
        <el-form-item label="页面标签" prop="page_label">
          <el-input v-model="formData.page_label" />
        </el-form-item>
        <el-form-item label="上传封面" prop="page_cover">
          <el-radio-group v-model="uploadType">
            <el-radio value="upload">上传文件</el-radio>
            <el-radio value="select">选择文件</el-radio>
            <el-radio value="input">填写链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <OptionImageUpload
          v-model="formData.page_cover"
          :upload-type="uploadType"
          upload-path="blog/page/"
        />
      </el-form>
      <template #footer>
        <el-button @click="modalVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import { PageAPI } from "@/api";
import type { UpdatePageReq, PageVO, QueryPageListReq } from "@/api/types";
import "@/styles/table.scss";
import RightToolbar from "@/components/RightToolbar/index.vue";
import OptionImageUpload from "@/components/Upload/OptionImageUpload.vue";

// 响应式数据
const route = useRoute();

const loading = ref(false);
const showSearch = ref(false);
const queryParams = ref<QueryPageListReq>({
  page: 1,
  page_size: 10,
});
const pageList = ref<PageVO[]>([]);
const count = ref(0);

// 表单相关
const modalVisible = ref(false);
const formRef = ref<FormInstance>();
const uploadType = ref("upload");

const initFormData: UpdatePageReq = {
  id: 0,
  page_name: "",
  page_label: "",
  page_cover: "",
};

const formData = reactive<UpdatePageReq>({ ...initFormData });

const formRules: FormRules<UpdatePageReq> = {
  page_name: [{ required: true, message: "请输入页面名称", trigger: "blur" }],
  page_label: [{ required: true, message: "请输入页面标签", trigger: "blur" }],
  page_cover: [{ required: true, message: "请上传页面封面", trigger: "blur" }],
};

// 计算属性
const dialogTitle = computed(() => (formData.id === 0 ? "添加页面" : "编辑页面"));

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
    const res = await PageAPI.queryPageList(queryParams.value);
    pageList.value = res.data.list;
    count.value = res.data.total;
  } finally {
    loading.value = false;
  }
};

const resetSearch = () => {
  queryParams.value = {
    page: 1,
    page_size: 10,
  };
  refreshList();
};

// 表单操作
const handleAdd = () => {
  Object.assign(formData, initFormData);
  uploadType.value = "upload";
  modalVisible.value = true;
};

const handleEdit = (data: PageVO) => {
  Object.assign(formData, data);
  uploadType.value = "upload";
  modalVisible.value = true;
};

const handleDelete = async (data: PageVO) => {
  try {
    await ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await PageAPI.batchDeletePage({ ids: [data.id!] });
    ElMessage.success("删除成功");
    refreshList();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error("删除失败: " + error.message);
    }
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    const data = { ...formData };
    if (data.id === 0) {
      await PageAPI.createPage(data);
      ElMessage.success("创建成功");
    } else {
      await PageAPI.updatePage(data);
      ElMessage.success("编辑成功");
    }

    modalVisible.value = false;
    refreshList();
  } catch {
    // 错误已由API处理
  }
};

// 初始化
onMounted(() => {
  refreshList();
});
</script>

<style scoped>
.page-cover {
  position: relative;
  width: 100%;
  height: 170px;
  border-radius: 4px;
}

.page-cover::before {
  position: absolute;
  inset: 0;
  content: "";
}

.page-name {
  margin-top: 0.5rem;
  text-align: center;
}

.page-item {
  position: relative;
  margin-bottom: 1rem;
  cursor: pointer;
}

.page-operation {
  position: absolute;
  top: 0.5rem;
  right: 0.8rem;
  z-index: 1000;
}
</style>
