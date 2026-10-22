<template>
  <div class="app-container">
    <el-card class="main-card">
      <!-- 标题 -->
      <div class="table-title">{{ route.meta.title }}</div>

      <!-- 操作按钮 -->
      <el-row :gutter="10" style="margin-bottom: 20px">
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Promotion"
            :disabled="!hasSelectedPhotos"
            @click="handleRecover"
          >
            批量恢复
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="!hasSelectedPhotos"
            @click="handleDelete"
          >
            批量销毁
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
        </el-col>
        <RightToolbar :search="false" @query-table="refreshList" />
      </el-row>
      <!-- 空状态 -->
      <el-empty
        v-if="!photoList?.length"
        style="width: 100%; height: 500px"
        description="暂无照片"
      />
      <!-- 照片列表 -->
      <el-checkbox-group
        v-model="selectPhotoIdList"
        style="min-height: 500px"
        @change="handleCheckedPhotoChange"
      >
        <el-row class="picture-list" :gutter="10">
          <el-col
            v-for="photo of photoList"
            :key="photo.id"
            :xs="12"
            :sm="6"
            :lg="4"
            style="margin-bottom: 1rem"
          >
            <el-checkbox :value="photo.id">
              <template #default>
                <div class="photo-item">
                  <el-image
                    class="photo-cover"
                    fit="cover"
                    :src="photo.photo_src"
                    :preview-src-list="[photo.photo_src]"
                  />
                  <div class="photo-name">{{ photo.photo_name }}</div>
                </div>
              </template>
            </el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
      <!-- 分页 -->
      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.page_size"
        class="pagination-container"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox, type CheckboxValueType } from "element-plus";
import { PhotoAPI } from "@/api";
import type { PhotoVO, QueryPhotoListReq } from "@/api/types";
import "@/styles/table.scss";
import RightToolbar from "@/components/RightToolbar/index.vue";

// 响应式数据
const route = useRoute();
const loading = ref(false);
const count = ref(0);
const queryParams = ref<QueryPhotoListReq>({
  page: 1,
  page_size: 10,
});
const photoList = ref<PhotoVO[]>([]);
const selectPhotoIdList = ref<number[]>([]);

// 计算属性
const photoIdList = computed(() => photoList.value?.map((photo) => photo.id!) || []);
const checkAll = computed({
  get: () => {
    const ids = photoIdList.value;
    return selectPhotoIdList.value.length === ids.length && ids.length > 0;
  },
  set: (val: boolean) => {
    selectPhotoIdList.value = val ? [...photoIdList.value] : [];
  },
});
const isIndeterminate = computed(() => {
  const count = selectPhotoIdList.value.length;
  return count > 0 && count < photoIdList.value.length;
});
const hasSelectedPhotos = computed(() => selectPhotoIdList.value.length > 0);

// 分页处理
const handleSizeChange = (size: number) => {
  queryParams.value.page_size = size;
  refreshList();
};

const handleCurrentChange = (current: number) => {
  queryParams.value.page = current;
  refreshList();
};

// 选择处理
const handleCheckAllChange = (val: CheckboxValueType) => {
  checkAll.value = !!val;
};

const handleCheckedPhotoChange = (value: CheckboxValueType[]) => {
  selectPhotoIdList.value = value.map((item) => Number(item));
};

// 操作处理
const handleRecover = async () => {
  try {
    await ElMessageBox.confirm("确认恢复已选中的数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await PhotoAPI.batchRestorePhoto({
      ids: selectPhotoIdList.value,
    });

    ElMessage.success("恢复成功");
    selectPhotoIdList.value = [];
    refreshList();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error("恢复失败: " + error.message);
    }
  }
};

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm("确认销毁已选中的数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await PhotoAPI.batchDeletePhoto({ ids: selectPhotoIdList.value });

    ElMessage.success("销毁成功");
    selectPhotoIdList.value = [];
    refreshList();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error("销毁失败: " + error.message);
    }
  }
};

// 列表获取
const refreshList = async () => {
  loading.value = true;
  try {
    const data: QueryPhotoListReq = {
      page: queryParams.value.page,
      page_size: queryParams.value.page_size,
      is_delete: 1, // 只查询已销毁的照片
    };

    const res = await PhotoAPI.queryPhotoList(data);
    photoList.value = res.data.list;
    count.value = res.data.total;
  } finally {
    loading.value = false;
  }
};

// 初始化
onMounted(() => {
  refreshList();
});
</script>

<style lang="scss" scoped>
.album-cover {
  width: 5rem;
  height: 5rem;
  border-radius: 4px;
}

.album-name {
  font-size: 1.25rem;
}

.photo-count {
  margin: 0 0 0.1rem 0.5rem;
  font-size: 13px;
}

.album-desc {
  margin-top: 0.4rem;
  font-size: 15px;
}

.select-count {
  margin-top: 0.4rem;
  font-size: 13px;
}

.photo-cover {
  position: relative;
  width: 100%;
  height: 8rem;
  overflow: hidden;
  border-radius: 4px;
}

.photo-cover::before {
  position: absolute;
  inset: 0;
  content: "";
  background: rgb(0 0 0 / 20%);
}

.photo-name {
  margin-top: 0.5rem;
  text-align: center;
}

.photo-item {
  position: relative;
  margin-bottom: 1rem;
  overflow: hidden;
  cursor: pointer;
}

.picture-list {
  :deep(.el-checkbox) {
    display: inline-block !important;
    width: 100%;
  }

  :deep(.el-checkbox__input) {
    position: absolute !important;
    top: 0.3rem;
    left: 0.8rem;
  }

  :deep(.el-checkbox__label) {
    width: 100%;
    padding: 0;
  }
}
</style>
