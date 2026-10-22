<template>
  <div class="app-container">
    <el-card class="main-card">
      <div class="table-title">{{ route.meta.title }}</div>
      <!-- 文章标题 -->
      <div class="article-title-container">
        <el-input v-model="article.article_title" placeholder="输入文章标题" size="default" />
        <el-button
          v-if="article.id == 0 || article.status == ArticleStatusEnum.DRAFT"
          class="save-btn"
          size="default"
          type="danger"
          @click="saveArticleDraft"
        >
          保存草稿
        </el-button>
        <el-button size="default" style="margin-left: 10px" type="danger" @click="openModel">
          发布文章
        </el-button>
      </div>
      <MdEditor
        ref="mdRef"
        v-model="article.article_content"
        :auto-detect-code="true"
        placeholder="快编辑一篇文章吧~"
        style="height: calc(100vh - 260px)"
        @on-upload-img="uploadImg"
      />
      <!-- 添加文章对话框 -->
      <el-dialog v-model="addOrEdit" width="500px" top="5vh" append-to-body>
        <template #header>
          <div class="dialog-title-container">发布文章</div>
        </template>
        <!-- 文章数据 -->
        <el-form :model="article" label-width="80px" size="default">
          <!-- 文章分类 -->
          <el-form-item label="文章分类">
            <el-tag
              v-show="article.category_name"
              :closable="true"
              style="margin: 0 1rem 0 0"
              type="success"
              @close="removeCategory"
            >
              {{ article.category_name }}
            </el-tag>
            <!-- 分类选项 -->
            <el-popover
              v-if="!article.category_name"
              placement="bottom-start"
              trigger="click"
              width="460"
            >
              <div class="popover-title">分类</div>
              <!-- 搜索框 -->
              <el-autocomplete
                v-model="categoryName"
                :fetch-suggestions="searchCategories"
                :trigger-on-focus="false"
                placeholder="请输入分类名搜索，enter可添加自定义分类"
                style="width: 100%"
                @select="handleSelectCategory"
                @keyup.enter="saveCategory"
              >
                <template #default="{ item }">
                  <div>{{ item.category_name }}</div>
                </template>
              </el-autocomplete>
              <!-- 分类 -->
              <div class="popover-container">
                <div
                  v-for="item of categoryList"
                  :key="item.id"
                  class="category-item"
                  @click="addCategory(item.category_name)"
                >
                  {{ item.category_name }}
                </div>
              </div>
              <template #reference>
                <el-button plain size="small" type="success">添加分类</el-button>
              </template>
            </el-popover>
          </el-form-item>
          <!-- 文章标签 -->
          <el-form-item label="文章标签">
            <el-tag
              v-for="(item, index) of article.tag_name_list"
              :key="index"
              :closable="true"
              style="margin: 0 1rem 0 0"
              @close="removeTag(item)"
            >
              {{ item }}
            </el-tag>
            <!-- 标签选项 -->
            <el-popover
              v-if="article.tag_name_list.length < 3"
              placement="bottom-start"
              trigger="click"
              width="460"
            >
              <div class="popover-title">标签</div>
              <!-- 搜索框 -->
              <el-autocomplete
                v-model="tagName"
                :fetch-suggestions="searchTags"
                :trigger-on-focus="false"
                placeholder="请输入标签名搜索，enter可添加自定义标签"
                style="width: 100%"
                @select="handleSelectTag"
                @keyup.enter="saveTag"
              >
                <template #default="{ item }">
                  <div>{{ item.tagName }}</div>
                </template>
              </el-autocomplete>
              <!-- 标签 -->
              <div class="popover-container">
                <div style="margin-bottom: 1rem">添加标签</div>
                <el-tag
                  v-for="(item, index) of tagList"
                  :key="index"
                  :class="tagClass(item)"
                  @click="addTag(item.tag_name)"
                >
                  {{ item.tag_name }}
                </el-tag>
              </div>
              <template #reference>
                <el-button plain size="small" type="primary">添加标签</el-button>
              </template>
            </el-popover>
          </el-form-item>
          <el-form-item label="文章类型">
            <el-select v-model="article.article_type" placeholder="请选择类型">
              <el-option
                v-for="item in typeList"
                :key="item.type"
                :label="item.label"
                :value="item.type"
              />
            </el-select>
          </el-form-item>
          <!-- 文章类型 -->
          <el-form-item v-if="article.article_type != ArticleTypeEnum.ORIGINAL" label="原文地址">
            <el-input v-model="article.original_url" placeholder="请填写原文链接" />
          </el-form-item>
          <el-form-item label="上传封面">
            <el-radio-group v-model="uploadType">
              <el-radio value="upload">上传文件</el-radio>
              <el-radio value="select">选择文件</el-radio>
              <el-radio value="input">填写链接</el-radio>
            </el-radio-group>
          </el-form-item>
          <OptionImageUpload
            v-model="article.article_cover"
            :upload-type="uploadType"
            upload-path="blog/article/"
          />
          <el-form-item label="置顶">
            <el-switch
              v-model="article.is_top"
              :active-value="ArticleTopEnum.YES"
              :inactive-value="ArticleTopEnum.NO"
              active-color="#13ce66"
              inactive-color="#cccccc"
            />
          </el-form-item>
          <el-form-item label="发布形式">
            <el-radio-group v-model="article.status">
              <el-radio :value="ArticleStatusEnum.PUBLIC">公开</el-radio>
              <el-radio :value="ArticleStatusEnum.PRIVATE">私密</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="addOrEdit = false">取 消</el-button>
          <el-button type="danger" @click="saveOrUpdateArticle">发 表</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { CategoryAPI } from "@/api";
import { TagAPI } from "@/api";
import { ArticleAPI } from "@/api";
import type { ArticleVO, CategoryVO, CreateArticleReq, UpdateArticleReq, TagVO } from "@/api/types";
import { ElMessage } from "element-plus";
import { uploadFile } from "@/utils/file";
import { useDateFormat } from "@vueuse/core";
import OptionImageUpload from "@/components/Upload/OptionImageUpload.vue";
import { ArticleStatusEnum, ArticleTopEnum, ArticleTypeEnum } from "@/enums/blog";
import { ApiCodeEnum } from "@/enums/api";

const route = useRoute();
const router = useRouter();
const article = ref<ArticleVO>({
  id: 0,
  article_title: useDateFormat(new Date(), "YYYY-MM-DD").value,
  article_content: "",
  article_cover: "",
  category_name: "",
  tag_name_list: [],
  article_type: ArticleTypeEnum.ORIGINAL,
  created_at: 0,
  original_url: "",
  is_top: 0,
  status: ArticleStatusEnum.PUBLIC,
  is_delete: 0,
  like_count: 0,
  updated_at: 0,
  view_count: 0,
});

const mdRef = ref(null);

const addOrEdit = ref(false);
const autoSave = ref(true);
const categoryName = ref("");
const tagName = ref("");
const categoryList = ref<CategoryVO[]>([]);
const tagList = ref<TagVO[]>([]);
const typeList = ref([
  {
    type: 1,
    label: "原创",
  },
  {
    type: 2,
    label: "转载",
  },
  {
    type: 3,
    label: "翻译",
  },
]);

function openModel() {
  if (article.value.article_title.trim() === "") {
    ElMessage.error("文章标题不能为空");
    return;
  }
  if (article.value.article_content.trim() === "") {
    ElMessage.error("文章内容不能为空");
    return;
  }
  listCategories();
  listTags();
  addOrEdit.value = true;
}

async function uploadImg(files: Array<File>, callback: (urls: string[]) => void) {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        uploadFile(file, "blog/article/")
          .then((res) => rev(res))
          .catch((error) => rej(error));
      });
    })
  );

  callback(res.map((item: any) => item.data.file_url));
}

function saveArticleDraft() {
  if (article.value.article_title.trim() === "") {
    ElMessage.error("文章标题不能为空");
    return;
  }
  if (article.value.article_content.trim() === "") {
    ElMessage.error("文章内容不能为空");
    return;
  }
  article.value.status = ArticleStatusEnum.DRAFT;
  saveArticle(article.value).then((res) => {
    if (res.code === ApiCodeEnum.SUCCESS) {
      if (article.value.id === null) {
        // store.commit("removeTab", "发布文章")
      } else {
        // store.commit("removeTab", "修改文章")
      }
      sessionStorage.removeItem("article");
      router.push({ path: "/article/list" });
      ElMessage.success("保存草稿成功");
    } else {
      ElMessage.error("保存草稿失败");
    }
  });

  autoSave.value = false;
}

function saveOrUpdateArticle() {
  if (article.value.article_title.trim() === "") {
    ElMessage.error("文章标题不能为空");
    return;
  }
  if (article.value.article_content.trim() === "") {
    ElMessage.error("文章内容不能为空");
    return;
  }
  if (!article.value.category_name) {
    ElMessage.error("文章分类不能为空");
    return;
  }
  if (article.value.tag_name_list.length === 0) {
    ElMessage.error("文章标签不能为空");
    return;
  }
  if (article.value.article_cover.trim() === "") {
    ElMessage.error("文章封面不能为空");
    return;
  }
  saveArticle(article.value).then((res) => {
    if (res.code === ApiCodeEnum.SUCCESS) {
      if (article.value.id === null) {
        // store.commit("removeTab", "发布文章")
      } else {
        // store.commit("removeTab", "修改文章")
      }
      sessionStorage.removeItem("article");
      router.push({ path: "/article/list" });
      ElMessage.success("发布文章成功");
    } else {
      ElMessage.error("发布文章失败");
    }
    addOrEdit.value = false;
  });

  autoSave.value = false;
}

// 调用点当前停用（见文件末尾的注释调用），保留实现备后续启用
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function autoSaveArticle() {
  console.log("autoSaveArticle");
  if (
    autoSave.value &&
    article.value.article_title.trim() !== "" &&
    article.value.article_content.trim() !== "" &&
    article.value.id !== null
  ) {
    saveArticle(article.value).then((res) => {
      if (res.code === ApiCodeEnum.SUCCESS) {
        ElMessage.success("自动保存成功");
      } else {
        ElMessage.error("自动保存失败");
      }
    });
  }
  if (autoSave.value && article.value.id === null) {
    sessionStorage.setItem("article", JSON.stringify(article.value));
  }
}

function saveArticle(article: CreateArticleReq & Partial<UpdateArticleReq>) {
  if ((article as any).id !== 0) {
    return ArticleAPI.updateArticle(article as UpdateArticleReq);
  } else {
    return ArticleAPI.createArticle(article as CreateArticleReq);
  }
}

onMounted(() => {
  CategoryAPI.queryCategoryList({
    page: 1,
    page_size: 20,
  }).then((res) => {
    categoryList.value = res.data.list;
  });

  TagAPI.queryTagList({
    page: 1,
    page_size: 20,
  }).then((res) => {
    tagList.value = res.data.list;
  });
});

function searchCategories(keywords: string, cb: any) {
  CategoryAPI.queryCategoryList({
    category_name: keywords,
  }).then((res) => {
    cb(res.data.list);
  });
}

function handleSelectCategory(item: any) {
  addCategory(item.value);
}

// 添加新的文章分类
function saveCategory() {
  if (categoryName.value.trim() !== "") {
    addCategory(categoryName.value);
    categoryName.value = "";
  }
}

// 添加文章分类
function addCategory(name: string) {
  article.value.category_name = name;
}

// 移除文章分类
function removeCategory() {
  article.value.category_name = "";
}

function searchTags(keywords: string, cb: any) {
  TagAPI.queryTagList({
    tag_name: keywords,
  }).then((res) => {
    cb(res.data.list);
  });
}

function handleSelectTag(item: Record<string, any>) {
  addTag(item.tag_name);
}

function saveTag() {
  if (tagName.value.trim() !== "") {
    addTag(tagName.value);
    tagName.value = "";
  }
}

function addTag(name: string) {
  if (!article.value.tag_name_list.includes(name)) {
    article.value.tag_name_list.push(name);
  }
}

function removeTag(name: string) {
  const index = article.value.tag_name_list.indexOf(name);
  if (index !== -1) {
    article.value.tag_name_list.splice(index, 1);
  }
}

const tagClass = (item: TagVO) => {
  const index = article.value.tag_name_list.indexOf(item.tag_name);
  return index !== -1 ? "tag-item-select" : "tag-item";
};

function listCategories() {
  CategoryAPI.queryCategoryList({}).then((res) => {
    categoryList.value = res.data.list;
  });
}

function listTags() {
  TagAPI.queryTagList({}).then((res) => {
    tagList.value = res.data.list;
  });
}

const getArticle = (articleId: number) => {
  ArticleAPI.getArticle({ id: articleId }).then((res) => {
    article.value = res.data;
  });
};

onMounted(() => {
  console.log("route.params.articleId", route.params.articleId);
  if (route.params.articleId) {
    const articleId = parseInt(route.params.articleId as string); // 获取路由参数
    getArticle(Number(articleId));
  } else {
    const articleData = sessionStorage.getItem("article");
    if (articleData) {
      article.value = JSON.parse(articleData);
    }
  }
});

onBeforeUnmount(() => {
  // autoSaveArticle();
});

const uploadType = ref("upload");
</script>

<style scoped>
.article-title-container {
  display: flex;
  align-items: center;
  margin-top: 2.25rem;
  margin-bottom: 1.25rem;
}

.save-btn {
  margin-left: 0.75rem;
  color: #f56c6c;
  background: #fff;
}

.tag-item {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}

.tag-item-select {
  margin-right: 1rem;
  margin-bottom: 1rem;
  color: #ccccd8 !important;
  cursor: not-allowed;
}

.category-item {
  padding: 0.6rem 0.5rem;
  cursor: pointer;
}

.category-item:hover {
  color: #67c23a;
  background-color: #f0f9eb;
}

.popover-title {
  margin-bottom: 1rem;
  text-align: center;
}

.popover-container {
  height: 260px;
  margin-top: 1rem;
  overflow-y: auto;
}
</style>
