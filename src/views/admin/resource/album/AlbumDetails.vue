<template>
  <div class="app-container">
    <el-card class="main-card">
      <!-- 标题 -->
      <div class="table-title">{{ route.meta.title }}</div>
      <!-- 相册信息 -->
      <el-row :gutter="12" style="margin-bottom: 15px">
        <el-col :span="1.5">
          <el-image fit="cover" class="album-cover" :src="albumInfo.album_cover" />
        </el-col>
        <el-col :span="12">
          <el-row align="bottom">
            <span class="album-name">{{ albumInfo.album_name }}</span>
          </el-row>
          <el-row class="album-desc">{{ albumInfo.album_desc }}</el-row>
          <el-row class="select-count">
            已选择 {{ selectPhotoIdList.length }}/{{ albumInfo.photo_count }} 张
          </el-row>
        </el-col>
      </el-row>
      <!-- 操作按钮 -->
      <el-row :gutter="10" style="margin-bottom: 20px">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Upload" @click="upload = true">上传</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Promotion"
            :disabled="!hasSelectedPhotos"
            @click="handleMove"
          >
            移动
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
            批量删除
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

        <RightToolbar :search="false" @query-table="refreshList"></RightToolbar>
      </el-row>
      <!-- 空状态 -->
      <el-empty
        v-if="photoList?.length === 0"
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
                  <div class="photo-operation">
                    <el-dropdown @command="(command) => handleCommand(command, photo)">
                      <el-icon style="color: #fff">
                        <MoreFilled />
                      </el-icon>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item command="preview" icon="View">预览</el-dropdown-item>
                          <el-dropdown-item command="edit" icon="Edit">编辑</el-dropdown-item>
                          <el-dropdown-item command="delete" icon="Delete">删除</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
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
    <!-- 修改对话框 -->
    <el-dialog v-model="modalVisible" title="修改照片" width="550px" append-to-body>
      <el-form ref="photoFormRef" label-width="100px" :model="photoForm" :rules="rules">
        <el-form-item label="照片名称" prop="photo_name">
          <el-input
            v-model="photoForm.photo_name"
            placeholder="请输入照片名称"
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="照片描述" prop="photo_desc">
          <el-input
            v-model="photoForm.photo_desc"
            placeholder="请输入照片描述"
            style="width: 250px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="modalVisible = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 上传对话框 -->
    <el-dialog v-model="upload" title="上传照片" width="50%" append-to-body>
      <MultiImageUpload
        v-model:file-list="uploadList"
        list-type="picture-card"
        :show-file-list="true"
        upload-path="blog/photo/"
      />
      <template #footer>
        <div class="dialog-footer">
          <div>共上传{{ uploadList?.length }}张照片</div>
          <div>
            <el-button type="primary" :disabled="uploadList.length == 0" @click="handleAdd">
              确 定
            </el-button>
            <el-button @click="upload = false">取 消</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { UploadUserFile } from "element-plus";
import { ElMessage, ElMessageBox, type CheckboxValueType, type FormInstance } from "element-plus";
import { AlbumAPI } from "@/api";
import { PhotoAPI } from "@/api";
import type {
  AlbumVO,
  CreatePhotoReq,
  UpdatePhotoReq,
  PhotoVO,
  QueryPhotoListReq,
} from "@/api/types";
import "@/styles/table.scss";
import RightToolbar from "@/components/RightToolbar/index.vue";
import MultiImageUpload from "@/components/Upload/MultiImageUpload.vue";

// 响应式数据
const route = useRoute();
const albumId = route.params.id ? parseInt(route.params.id as string) : 0;
const loading = ref(false);
const count = ref(0);
const queryParams = ref<QueryPhotoListReq>({
  page: 1,
  page_size: 10,
});
const photoList = ref<PhotoVO[]>([]);
const albumInfo = ref<AlbumVO>({} as AlbumVO);
const selectPhotoIdList = ref<number[]>([]);

// 表单相关
const modalVisible = ref(false);
const upload = ref(false);
const photoFormRef = ref<FormInstance>();
const photoForm = ref<UpdatePhotoReq>({} as UpdatePhotoReq);
const uploadList = ref<UploadUserFile[]>([]);

// 表单验证规则
const rules = {
  photo_name: [{ required: true, message: "请输入照片名称", trigger: "blur" }],
};
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
const handleEdit = (photo: PhotoVO) => {
  photoFormRef.value?.resetFields();
  photoForm.value = photo as any;
  modalVisible.value = true;
};

const handleSingleDelete = async (photo: PhotoVO) => {
  try {
    await ElMessageBox.confirm(`确认删除照片「${photo.photo_name}」?`, "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await PhotoAPI.batchDeletePhoto({
      ids: [photo.id!],
      });

    ElMessage.success("删除成功");
    refreshList();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error("删除失败: " + error.message);
    }
  }
};

const handleMove = () => {
  ElMessage.warning("该功能暂未实现");
};

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await PhotoAPI.batchDeletePhoto({
      ids: selectPhotoIdList.value,
      });

    ElMessage.success("删除成功");
    selectPhotoIdList.value = [];
    refreshList();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error("删除失败: " + error.message);
    }
  }
};

const handleCommand = (command: string, photo: PhotoVO) => {
  if (command === "preview") {
    handlePreview(photo);
  } else if (command === "edit") {
    handleEdit(photo);
  } else if (command === "delete") {
    handleSingleDelete(photo);
  }
};

const handlePreview = (photo: PhotoVO) => {
  const img = document.querySelector(`img[src="${photo.photo_src}"]`) as HTMLImageElement;
  if (img) {
    img.click();
  }
};

const handleAdd = async () => {
  if (uploadList.value.length === 0) return;

  try {
    const promises = uploadList.value.map((item) => {
      const data: CreatePhotoReq = {
        album_id: albumId,
        photo_name: item.name || "未命名照片",
        photo_desc: "",
        photo_src: item.url || "",
      };
      return PhotoAPI.createPhoto(data);
    });

    await Promise.all(promises);
    ElMessage.success(`成功添加${uploadList.value.length}张照片`);
    uploadList.value = [];
    upload.value = false;
    refreshList();
  } catch (error: any) {
    ElMessage.error("添加照片失败: " + error.message);
  }
};

const handleSubmit = async () => {
  if (!photoFormRef.value) return;

  try {
    const valid = await photoFormRef.value.validate();
    if (!valid) return;

    await PhotoAPI.updatePhoto(photoForm.value);
    ElMessage.success("编辑成功");
    modalVisible.value = false;
    refreshList();
  } catch {
    // 错误已由API处理
  }
};

// 列表获取
const refreshList = async () => {
  loading.value = true;
  try {
    const data: QueryPhotoListReq = {
      page: queryParams.value.page,
      page_size: queryParams.value.page_size,
      album_id: albumId,
    };

    const res = await PhotoAPI.queryPhotoList(data);
    photoList.value = res.data.list;
    count.value = res.data.total;
  } finally {
    loading.value = false;
  }
};

const getAlbumInfo = async (id: number) => {
  try {
    const res = await AlbumAPI.getAlbum({ id });
    albumInfo.value = res.data;
    document.title = `${albumInfo.value.album_name} - 相册`;
  } catch {
    // 错误已由API处理
  }
};

// 初始化
onMounted(() => {
  getAlbumInfo(albumId);
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
  background: rgb(0 0 0 / 10%);
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

.photo-operation {
  position: absolute;
  top: 0.5rem;
  right: 0.8rem;
  z-index: 1000;
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
