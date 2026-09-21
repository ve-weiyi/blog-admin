<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <!-- 左侧个人信息卡片 -->
      <el-col :span="8">
        <el-card class="user-card">
          <div class="user-info">
            <div class="avatar-wrapper">
              <el-avatar :src="userProfile.avatar" :size="100" />
              <el-button
                type="info"
                class="avatar-edit-btn"
                circle
                :icon="Camera"
                size="small"
                @click="triggerFileUpload"
              />
              <input
                ref="fileInput"
                type="file"
                style="display: none"
                accept="image/*"
                @change="handleFileChange"
              />
            </div>
            <div class="user-name">
              <span class="nickname">{{ userProfile.nickname }}</span>
              <el-icon class="edit-icon" @click="handleOpenDialog(DialogType.ACCOUNT)">
                <Edit />
              </el-icon>
            </div>
            <div class="user-role">{{ userProfile.roles }}</div>
          </div>
          <el-divider />
          <div class="user-stats">
            <div class="stat-item">
              <div class="stat-value">0</div>
              <div class="stat-label">待办</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">0</div>
              <div class="stat-label">消息</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">0</div>
              <div class="stat-label">通知</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧信息卡片 -->
      <el-col :span="16">
        <!-- 账号信息 -->
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>账号信息</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户名">
              {{ userProfile.username }}
              <el-icon v-if="userProfile.gender === 0" class="gender-icon male">
                <Loading />
              </el-icon>
              <el-icon v-else-if="userProfile.gender === 1" class="gender-icon male">
                <Male />
              </el-icon>
              <el-icon v-else class="gender-icon female">
                <Female />
              </el-icon>
            </el-descriptions-item>
            <el-descriptions-item label="手机号码">
              {{ userProfile.mobile || "未绑定" }}
            </el-descriptions-item>
            <el-descriptions-item label="邮箱">
              {{ userProfile.email || "未绑定" }}
            </el-descriptions-item>
            <el-descriptions-item label="个人介绍">
              {{ userProfile.intro }}
            </el-descriptions-item>
            <el-descriptions-item label="个人网站">
              {{ userProfile.website }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ userProfile.created_at }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
        <!-- 安全设置 -->
        <el-card class="security-card">
          <template #header>
            <div class="card-header">
              <span>安全设置</span>
            </div>
          </template>
          <!-- 账户密码 -->
          <div class="security-item">
            <div class="security-info">
              <div class="security-title">账户密码</div>
              <div class="security-desc">定期修改密码有助于保护账户安全</div>
            </div>
            <el-button type="primary" link @click="() => handleOpenDialog(DialogType.PASSWORD)">
              修改
            </el-button>
          </div>
          <!-- 绑定手机 -->
          <div class="security-item">
            <div class="security-info">
              <div class="security-title">绑定手机</div>
              <div class="security-desc">
                <span v-if="userProfile.mobile">已绑定手机号：{{ userProfile.mobile }}</span>
                <span v-else>未绑定手机</span>
              </div>
            </div>
            <el-button type="primary" link @click="() => handleOpenDialog(DialogType.MOBILE)">
              修改
            </el-button>
          </div>
          <!-- 绑定邮箱 -->
          <div class="security-item">
            <div class="security-info">
              <div class="security-title">绑定邮箱</div>
              <div class="security-desc">
                <span v-if="userProfile.email">已绑定邮箱：{{ userProfile.email }}</span>
                <span v-else>未绑定邮箱</span>
              </div>
            </div>
            <el-button type="primary" link @click="() => handleOpenDialog(DialogType.EMAIL)">
              修改
            </el-button>
          </div>
          <!-- 绑定第三方账号 -->
          <div>
            <div class="security-title">绑定第三方账号</div>
            <p class="tip-text">
              使用以下任一方式都可以登录到您的
              <strong>blog</strong>
              帐号
            </p>

            <el-table :data="userProfile.third_party" label-width="auto" border>
              <el-table-column prop="index" label="序号" width="60" align="center">
                <template #default="{ $index }">{{ $index + 1 }}</template>
              </el-table-column>
              <el-table-column
                prop="platform"
                label="平台"
                width="100"
                align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="account"
                label="详情"
                width="150"
                align="center"
                show-overflow-tooltip
              >
                <template #default="{ row }">
                  <div class="flex justify-center">
                    <el-avatar :src="row.avatar" :size="24" />
                    <span class="ml-2">{{ row.nickname }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="created_at" label="绑定时间" width="200" align="center">
                <template #default="{ row }">
                  {{ useDateFormat(row.created_at) }}
                </template>
              </el-table-column>
              <el-table-column label="状态" width="100" align="center">
                <template #default><span class="status-active">● 使用中</span></template>
              </el-table-column>
              <el-table-column label="操作" width="100" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button type="danger" link @click="handleUnbindAccount(row.platform)">
                    解除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div class="bind-more">
              <p class="bind-title">可绑定的第三方账号</p>
              <div class="platform-list">
                <div v-for="item in availablePlatforms" :key="item.platform" class="platform-tag">
                  <div
                    class="text-32px cursor-pointer"
                    :class="item.icon"
                    @click="handleBindAccount(item.platform)"
                  />
                  <span>{{ item.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        <!-- 登录历史 -->
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>登录历史</span>
            </div>
          </template>
          <el-auto-resizer>
            <template #default="{ width }">
              <el-table-v2
                :columns="loginHistoryColumns"
                :data="tableData"
                :width="width"
                :height="600"
                :fixed="true"
              >
                <template #empty>
                  <div class="flex items-center justify-center h-100%">
                    <el-empty />
                  </div>
                </template>
              </el-table-v2>
            </template>
          </el-auto-resizer>
        </el-card>
      </el-col>
    </el-row>

    <!-- 弹窗 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" :width="500">
      <!-- 账号资料 -->
      <el-form
        v-if="dialog.type === DialogType.ACCOUNT"
        ref="userProfileFormRef"
        :model="userProfileForm"
        :label-width="100"
      >
        <el-form-item label="昵称">
          <el-input v-model="userProfileForm.nickname" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="userProfileForm.gender">
            <el-option label="保密" :value="0" />
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="userProfileForm.intro" />
        </el-form-item>
        <el-form-item label="个人网站">
          <el-input v-model="userProfileForm.website" />
        </el-form-item>
      </el-form>

      <!-- 修改密码 -->
      <el-form
        v-if="dialog.type === DialogType.PASSWORD"
        ref="passwordChangeFormRef"
        :model="passwordChangeForm"
        :rules="passwordChangeRules"
        :label-width="100"
      >
        <el-form-item label="原密码" prop="old_password">
          <el-input v-model="passwordChangeForm.old_password" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input v-model="passwordChangeForm.new_password" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input v-model="passwordChangeForm.confirm_password" type="password" show-password />
        </el-form-item>
      </el-form>

      <!-- 绑定手机 -->
      <el-form
        v-else-if="dialog.type === DialogType.MOBILE"
        ref="mobileBindingFormRef"
        :model="mobileUpdateForm"
        :rules="mobileBindingRules"
        :label-width="100"
      >
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="mobileUpdateForm.mobile" style="width: 250px" />
        </el-form-item>
        <el-form-item label="验证码" prop="verify_code">
          <el-input v-model="mobileUpdateForm.verify_code" style="width: 250px">
            <template #append>
              <el-button :disabled="mobileCountdown > 0" @click="handleSendMobileCode">
                {{ mobileCountdown > 0 ? `${mobileCountdown}s后重新发送` : "发送验证码" }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <!-- 绑定邮箱 -->
      <el-form
        v-else-if="dialog.type === DialogType.EMAIL"
        ref="emailBindingFormRef"
        :model="emailUpdateForm"
        :rules="emailBindingRules"
        :label-width="100"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="emailUpdateForm.email" style="width: 250px" />
        </el-form-item>
        <el-form-item label="验证码" prop="verify_code">
          <el-input v-model="emailUpdateForm.verify_code" style="width: 250px">
            <template #append>
              <el-button :disabled="emailCountdown > 0" @click="handleSendEmailCode">
                {{ emailCountdown > 0 ? `${emailCountdown}s后重新发送` : "发送验证码" }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog.visible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Camera, Edit, Female, Loading, Male } from "@element-plus/icons-vue";
import type {
  UpdateMePasswordReq,
  UpdateMeReq,
  UserProfile,
  BindMeEmailReq,
  BindMeMobileReq,
} from "@/api/types";
import { MeAPI, AuthAPI } from "@/api";
import { loginHistoryColumns } from "./columns";
import { useDateFormat } from "@vueuse/core";
import { uploadFile } from "@/utils/file";

// 用户信息
const userProfile = ref<UserProfile>({} as UserProfile);

const enum DialogType {
  ACCOUNT = "account",
  PASSWORD = "password",
  MOBILE = "mobile",
  EMAIL = "email",
}

const dialog = reactive({
  visible: false,
  title: "",
  type: "" as DialogType,
});

const userProfileForm = reactive<UpdateMeReq>({} as UpdateMeReq);
const passwordChangeForm = reactive<UpdateMePasswordReq>({} as UpdateMePasswordReq);
const mobileUpdateForm = reactive<BindMeMobileReq>({} as BindMeMobileReq);
const emailUpdateForm = reactive<BindMeEmailReq>({} as BindMeEmailReq);

const mobileCountdown = ref(0);
const mobileTimer = ref<ReturnType<typeof setInterval>>();

const emailCountdown = ref(0);
const emailTimer = ref<ReturnType<typeof setInterval>>();

// 修改密码校验规则
const passwordChangeRules = {
  old_password: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  new_password: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirm_password: [{ required: true, message: "请再次输入新密码", trigger: "blur" }],
};

// 手机号校验规则
const mobileBindingRules = {
  mobile: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" },
  ],
  verify_code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

// 邮箱校验规则
const emailBindingRules = {
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  verify_code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
};

/**
 * 打开弹窗
 */
const handleOpenDialog = (type: DialogType) => {
  dialog.type = type;
  dialog.visible = true;
  switch (type) {
    case DialogType.ACCOUNT:
      dialog.title = "账号资料";
      userProfileForm.nickname = userProfile.value.nickname;
      userProfileForm.gender = userProfile.value.gender;
      userProfileForm.intro = userProfile.value.intro;
      userProfileForm.website = userProfile.value.website;
      break;
    case DialogType.PASSWORD:
      dialog.title = "修改密码";
      break;
    case DialogType.MOBILE:
      dialog.title = "绑定手机";
      break;
    case DialogType.EMAIL:
      dialog.title = "绑定邮箱";
      break;
  }
};

/**
 * 发送手机验证码
 */
function handleSendMobileCode() {
  if (!mobileUpdateForm.mobile) {
    ElMessage.error("请输入手机号");
    return;
  }
  const reg = /^1[3-9]\d{9}$/;
  if (!reg.test(mobileUpdateForm.mobile)) {
    ElMessage.error("手机号格式不正确");
    return;
  }
  AuthAPI.sendMobileCode({
    mobile: mobileUpdateForm.mobile,
    type: "bind_mobile",
  }).then(() => {
    ElMessage.success("验证码发送成功");
    mobileCountdown.value = 60;
    mobileTimer.value = setInterval(() => {
      if (mobileCountdown.value > 0) {
        mobileCountdown.value -= 1;
      } else {
        clearInterval(mobileTimer.value!);
      }
    }, 1000);
  });
}

/**
 * 发送邮箱验证码
 */
function handleSendEmailCode() {
  if (!emailUpdateForm.email) {
    ElMessage.error("请输入邮箱");
    return;
  }
  const reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
  if (!reg.test(emailUpdateForm.email)) {
    ElMessage.error("邮箱格式不正确");
    return;
  }
  AuthAPI.sendEmailCode({
    email: emailUpdateForm.email,
    type: "bind_email",
  }).then(() => {
    ElMessage.success("验证码发送成功");
    emailCountdown.value = 60;
    emailTimer.value = setInterval(() => {
      if (emailCountdown.value > 0) {
        emailCountdown.value -= 1;
      } else {
        clearInterval(emailTimer.value!);
      }
    }, 1000);
  });
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (dialog.type === DialogType.ACCOUNT) {
    MeAPI.updateMe(userProfileForm).then(() => {
      ElMessage.success("账号资料修改成功");
      dialog.visible = false;
      loadUserProfile();
    });
  } else if (dialog.type === DialogType.PASSWORD) {
    if (passwordChangeForm.new_password !== passwordChangeForm.confirm_password) {
      ElMessage.error("两次输入的密码不一致");
      return;
    }
    MeAPI.updateMePassword(passwordChangeForm).then(() => {
      ElMessage.success("密码修改成功");
      dialog.visible = false;
    });
  } else if (dialog.type === DialogType.MOBILE) {
    MeAPI.bindMeMobile(mobileUpdateForm).then(() => {
      ElMessage.success("手机号绑定成功");
      dialog.visible = false;
      loadUserProfile();
    });
  } else if (dialog.type === DialogType.EMAIL) {
    MeAPI.bindMeEmail(emailUpdateForm).then(() => {
      ElMessage.success("邮箱绑定成功");
      dialog.visible = false;
      loadUserProfile();
    });
  }
};

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files[0] : null;
  if (file) {
    try {
      const res = await uploadFile(file, "blog/avatar/");
      userProfile.value.avatar = res.data.file_info.file_url;
      await MeAPI.updateMeAvatar({ avatar: res.data.file_info.file_url });
      ElMessage.success("头像上传成功");
    } catch (error) {
      ElMessage.error("头像上传失败" + error);
    }
  }
};

/** 加载用户信息 */
const loadUserProfile = async () => {
  const res = await MeAPI.getMe();
  userProfile.value = res.data;
};

const loading = ref<boolean>(false);
const tableData = ref<any[]>([]);

const getHistory = async () => {
  loading.value = true;
  MeAPI.queryMeLoginLogList({})
    .then((response) => {
      tableData.value = response.data.list || [];
    })
    .finally(() => {
      loading.value = false;
    });
};

/** 解绑第三方平台账号 */
const handleUnbindAccount = (platform: string) => {
  ElMessageBox.confirm("确定要解绑吗？解除绑定后无法使用该平台登录", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    MeAPI.unbindMeThirdParty({ platform }).then(() => {
      ElMessage.success("解绑成功");
      loadUserProfile();
    });
  });
};

const availablePlatforms = [
  { platform: "wechat", name: "微信", icon: "i-svg:wechat" },
  { platform: "qq", name: "QQ", icon: "i-svg:qq" },
  { platform: "github", name: "GitHub", icon: "i-svg:github" },
  { platform: "gitee", name: "Gitee", icon: "i-svg:gitee" },
];

/** 绑定第三方平台账号 */
const handleBindAccount = (platform: string) => {
  AuthAPI.getOauthAuthorizeUrl({ platform }).then((res) => {
    if (res.data?.authorize_url) {
      window.open(res.data.authorize_url, "_self");
    } else {
      ElMessage.error("获取授权地址失败");
    }
  });
};

onMounted(async () => {
  await loadUserProfile();
  await getHistory();
});

onUnmounted(() => {
  if (mobileTimer.value) {
    clearInterval(mobileTimer.value);
  }
  if (emailTimer.value) {
    clearInterval(emailTimer.value);
  }
});
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 16px;
}

.user-card {
  .user-info {
    padding: 10px 0;
    text-align: center;
  }

  .avatar-wrapper {
    position: relative;
    display: inline-block;

    .avatar-edit-btn {
      position: absolute;
      right: -5px;
      bottom: 0;
    }
  }

  .user-name {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    margin-top: 16px;

    .nickname {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .edit-icon {
      color: var(--el-text-color-secondary);
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary);
      }
    }
  }

  .user-role {
    margin-top: 8px;
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  .user-stats {
    display: flex;
    justify-content: space-around;
    text-align: center;

    .stat-item {
      .stat-value {
        font-size: 20px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .stat-label {
        margin-top: 4px;
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

.info-card,
.security-card {
  margin-bottom: 20px;
}

.card-header {
  font-weight: 600;
}

.gender-icon {
  margin-left: 8px;

  &.male {
    color: #409eff;
  }

  &.female {
    color: #e45d7c;
  }
}

.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;

  &:not(:last-child) {
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .security-info {
    .security-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);
    }

    .security-desc {
      margin-top: 4px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
}

.tip-text {
  margin-bottom: 16px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.status-active {
  font-size: 12px;
  color: #67c23a;
}

.bind-more {
  margin-top: 20px;

  .bind-title {
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 500;
  }

  .platform-list {
    display: flex;
    gap: 20px;

    .platform-tag {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: center;
      cursor: pointer;

      span {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>
