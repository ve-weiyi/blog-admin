<template>
  <el-card class="main-card">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 修改信息 -->
      <el-tab-pane label="网站信息" name="info">
        <el-form v-model="websiteConfigForm" label-position="left" label-width="100px">
          <el-form-item label="网站头像">
            <el-upload
              :show-file-list="false"
              :http-request="onUpload"
              :before-upload="beforeUpload"
              class="avatar-uploader"
              :on-success="handleWebsiteAvatarSuccess"
            >
              <img
                v-if="websiteConfigForm.website_info.website_avatar"
                :src="websiteConfigForm.website_info.website_avatar"
                alt="img"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="网站名称">
            <el-input
              v-model="websiteConfigForm.website_info.website_name"
              size="small"
              style="width: 400px"
            />
          </el-form-item>
          <el-form-item label="网站作者">
            <el-input
              v-model="websiteConfigForm.website_info.website_author"
              size="small"
              style="width: 400px"
            />
          </el-form-item>
          <el-form-item label="网站简介">
            <el-input
              v-model="websiteConfigForm.website_info.website_intro"
              size="small"
              style="width: 400px"
            />
          </el-form-item>
          <el-form-item label="网站创建日期">
            <el-date-picker
              v-model="websiteConfigForm.website_info.website_create_time"
              placeholder="选择日期"
              style="width: 400px"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="网站公告">
            <el-input
              v-model="websiteConfigForm.website_info.website_notice"
              :rows="5"
              placeholder="请输入公告内容"
              style="width: 400px"
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="备案号">
            <el-input
              v-model="websiteConfigForm.website_info.website_record_no"
              size="small"
              style="width: 400px"
            />
          </el-form-item>
          <el-form-item label="第三方登录">
            <el-checkbox
              v-for="item in websiteConfigForm.social_login_list"
              :key="item.platform"
              v-model="item.enabled"
              :label="item.name"
            >
              {{ item.name }}
            </el-checkbox>
          </el-form-item>
          <el-button
            size="default"
            style="margin-left: 6.3rem"
            type="primary"
            @click="updateWebsiteConfig"
          >
            修改
          </el-button>
        </el-form>
      </el-tab-pane>
      <!-- 网站公告 -->
      <el-tab-pane label="社交信息" name="notice">
        <el-form v-model="websiteConfigForm" label-width="100px">
          <el-table :data="websiteConfigForm.social_url_list" :style="{ width: '100%' }" border>
            <el-table-column prop="name" label="平台名称" width="140">
              <template #default="scope">
                <el-input v-model="scope.row.name" placeholder="如: 微信"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="platform" label="平台标识" width="140">
              <template #default="scope">
                <el-input v-model="scope.row.platform" placeholder="如: wechat"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="link_url" label="社交地址">
              <template #default="scope">
                <el-input v-model="scope.row.link_url" placeholder="社交地址URL"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="enabled" label="是否展示" width="100">
              <template #default="scope">
                <el-checkbox v-model="scope.row.enabled"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button size="small" type="danger" @click="removeSocialUrl(scope.$index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <el-button type="primary" icon="el-icon-plus" @click="addSocialUrl">
              新增社交平台
            </el-button>
            <el-button type="primary" style="margin-left: 20px" @click="updateWebsiteConfig">
              保存配置
            </el-button>
          </div>
        </el-form>
      </el-tab-pane>
      <!-- 修改密码 -->
      <el-tab-pane label="其他设置" name="password">
        <el-form v-model="websiteConfigForm" label-position="left" label-width="120px">
          <el-row style="width: 600px">
            <el-col :md="12">
              <el-form-item label="用户头像">
                <el-upload
                  :show-file-list="false"
                  :http-request="onUpload"
                  :before-upload="beforeUpload"
                  class="avatar-uploader"
                  :on-success="handleUserAvatarSuccess"
                >
                  <img
                    v-if="websiteConfigForm.user_avatar"
                    :src="websiteConfigForm.user_avatar"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="游客头像">
                <el-upload
                  :show-file-list="false"
                  :http-request="onUpload"
                  :before-upload="beforeUpload"
                  :on-success="handleTouristAvatarSuccess"
                  class="avatar-uploader"
                >
                  <img
                    v-if="websiteConfigForm.tourist_avatar"
                    :src="websiteConfigForm.tourist_avatar"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="邮箱通知">
            <el-radio-group v-model="websiteConfigForm.website_feature.is_email_notice">
              <el-radio :value="SwitchEnum.OFF">关闭</el-radio>
              <el-radio :value="SwitchEnum.ON">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="评论审核">
            <el-radio-group v-model="websiteConfigForm.website_feature.is_comment_review">
              <el-radio :value="SwitchEnum.OFF">关闭</el-radio>
              <el-radio :value="SwitchEnum.ON">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="留言审核">
            <el-radio-group v-model="websiteConfigForm.website_feature.is_message_review">
              <el-radio :value="SwitchEnum.OFF">关闭</el-radio>
              <el-radio :value="SwitchEnum.ON">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="聊天室状态">
            <el-radio-group v-model="websiteConfigForm.website_feature.is_chat_room">
              <el-radio :value="SwitchEnum.OFF">关闭</el-radio>
              <el-radio :value="SwitchEnum.ON">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="音乐播放器状态">
            <el-radio-group v-model="websiteConfigForm.website_feature.is_music_player">
              <el-radio :value="SwitchEnum.OFF">关闭</el-radio>
              <el-radio :value="SwitchEnum.ON">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="AI助手状态">
            <el-radio-group v-model="websiteConfigForm.website_feature.is_ai_assistant">
              <el-radio :value="SwitchEnum.OFF">关闭</el-radio>
              <el-radio :value="SwitchEnum.ON">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="打赏状态">
            <el-radio-group v-model="websiteConfigForm.website_feature.is_reward">
              <el-radio :label="SwitchEnum.OFF" :value="SwitchEnum.OFF">关闭</el-radio>
              <el-radio :label="SwitchEnum.ON" :value="SwitchEnum.ON">开启</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row
            v-show="websiteConfigForm.website_feature.is_reward === SwitchEnum.ON"
            style="width: 600px"
          >
            <el-col :md="12">
              <el-form-item label="微信收款码">
                <el-upload
                  :show-file-list="false"
                  :http-request="onUpload"
                  :before-upload="beforeUpload"
                  class="avatar-uploader"
                  :on-success="handleWeiXinSuccess"
                >
                  <img
                    v-if="websiteConfigForm.reward_qr_code.weixin_qr_code"
                    :src="websiteConfigForm.reward_qr_code.weixin_qr_code"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="支付宝收款码">
                <el-upload
                  :show-file-list="false"
                  :http-request="onUpload"
                  :before-upload="beforeUpload"
                  class="avatar-uploader"
                  :on-success="handleAlipaySuccess"
                >
                  <img
                    v-if="websiteConfigForm.reward_qr_code.alipay_qr_code"
                    :src="websiteConfigForm.reward_qr_code.alipay_qr_code"
                    class="avatar"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            v-show="websiteConfigForm.website_feature.is_chat_room === SwitchEnum.ON"
            label="Websocket地址"
          >
            <el-input v-model="websiteConfigForm.websocket_url" size="small" style="width: 400px" />
          </el-form-item>
          <el-form-item label="Admin地址">
            <el-input v-model="websiteConfigForm.admin_url" size="small" style="width: 400px" />
          </el-form-item>
          <el-button
            size="default"
            style="margin-left: 6.3rem"
            type="primary"
            @click="updateWebsiteConfig"
          >
            修改
          </el-button>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { UploadRawFile, UploadRequestOptions } from "element-plus";
import { ElMessage } from "element-plus";
import { ConfigAPI } from "@/api";
import { uploadFile } from "@/utils/file";
import { FileInfoVO, WebsiteConfigVO } from "@/api/types";
import { SwitchEnum } from "@/enums/blog";

const websiteConfigForm = ref<WebsiteConfigVO>({
  admin_url: "https://admin.veweiyi.cn",
  websocket_url: "wss://app.veweiyi.cn/api/websocket",
  tourist_avatar: "",
  user_avatar: "",
  website_feature: {
    is_chat_room: SwitchEnum.ON,
    is_ai_assistant: SwitchEnum.ON,
    is_music_player: SwitchEnum.ON,
    is_comment_review: SwitchEnum.OFF,
    is_email_notice: SwitchEnum.ON,
    is_message_review: SwitchEnum.OFF,
    is_reward: SwitchEnum.OFF,
  },
  website_info: {
    website_author: "与梦",
    website_avatar: "https://static.veweiyi.cn/blog/website/tiger-20241115175746.jpg",
    website_create_time: "2022-01-17",
    website_intro: "你能做的，岂止如此。",
    website_name: "与梦",
    website_notice: "网站搭建问题请联系QQ 791422171。",
    website_record_no: "桂ICP备2023013735号-1",
  },
  reward_qr_code: {
    alipay_qr_code: "",
    weixin_qr_code: "",
  },
  social_login_list: [],
  social_url_list: [],
});

const activeName = ref("info");

onMounted(() => {
  getWebsiteConfig();
});

function getWebsiteConfig() {
  ConfigAPI.getWebsiteConfig().then((res) => {
    websiteConfigForm.value = res.data;
  });
}

function updateWebsiteConfig() {
  ConfigAPI.updateWebsiteConfig(websiteConfigForm.value).then((res) => {
    ElMessage.success(res.message);
  });
}

function handleClick() {}

// 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
function beforeUpload(rawFile: UploadRawFile) {
  return rawFile;
}

function onUpload(options: UploadRequestOptions) {
  return uploadFile(options.file, "blog/website/");
}

function handleWebsiteAvatarSuccess(response: { data: FileInfoVO }) {
  websiteConfigForm.value.website_info.website_avatar = response.data.file_url;
  updateWebsiteConfig();
}

function handleUserAvatarSuccess(response: { data: FileInfoVO }) {
  websiteConfigForm.value.user_avatar = response.data.file_url;
}

function handleTouristAvatarSuccess(response: { data: FileInfoVO }) {
  websiteConfigForm.value.tourist_avatar = response.data.file_url;
}

function handleWeiXinSuccess(response: { data: FileInfoVO }) {
  websiteConfigForm.value.reward_qr_code.weixin_qr_code = response.data.file_url;
}

function handleAlipaySuccess(response: { data: FileInfoVO }) {
  websiteConfigForm.value.reward_qr_code.alipay_qr_code = response.data.file_url;
}

// 新增社交平台
function addSocialUrl() {
  websiteConfigForm.value.social_url_list.push({
    name: "",
    platform: "",
    link_url: "",
    enabled: false,
  });
}

// 删除社交平台
function removeSocialUrl(index: number) {
  ElMessageBox.confirm("确定要删除这条社交信息吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      websiteConfigForm.value.social_url_list.splice(index, 1);
      ElMessage.success("删除成功");
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
}
</script>

<style>
.avatar-uploader .el-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  width: 120px;
  height: 120px;
  font-size: 28px;
  line-height: 120px;
  color: #8c939d;
  text-align: center;
}

.avatar {
  display: block;
  width: 120px;
  height: 120px;
}
</style>
