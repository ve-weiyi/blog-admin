<template>
  <div class="app-container">
    <el-card class="main-card">
      <div class="table-title">{{ route.meta.title }}</div>
      <MdEditor
        ref="mdRef"
        v-model="aboutContent"
        :auto-detect-code="true"
        placeholder="快编辑你的个人信息吧~"
        style="height: calc(100vh - 250px); margin-top: 2.25rem"
        @on-upload-img="uploadImg"
      />
      <el-button class="edit-btn" size="default" type="danger" @click="updateAbout">修改</el-button>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElNotification } from "element-plus";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { ConfigAPI } from "@/api";
import { useRoute } from "vue-router";
import { uploadFile } from "@/utils/file";

const route = useRoute();

const mdRef = ref(null);
const aboutContent = ref("");

const getAbout = () => {
  ConfigAPI.getAboutMe().then((res) => {
    aboutContent.value = res.data.content;
  });
};

async function uploadImg(files: Array<File>, callback: (urls: string[]) => void) {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        uploadFile(file, "blog/about/")
          .then((res) => rev(res))
          .catch((error) => rej(error));
      });
    })
  );

  callback(res.map((item: any) => item.data.file_url));
}

const updateAbout = () => {
  const data = {
    content: aboutContent.value,
  };
  ConfigAPI.updateAboutMe(data).then((res) => {
    ElNotification.success({
      title: "成功",
      message: res.message,
    });
  });
};

onMounted(() => {
  getAbout();
});
</script>

<style scoped>
.edit-btn {
  float: right;
  margin: 1rem 0;
}
</style>
