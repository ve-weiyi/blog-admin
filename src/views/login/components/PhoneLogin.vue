<template>
  <div>
    <h3 text-center m-0 mb-20px>登录</h3>
    <el-form ref="loginFormRef" :model="loginFormData" :rules="loginRules" size="large">
      <!-- 手机号 -->
      <el-form-item prop="mobile">
        <el-input v-model.trim="loginFormData.mobile" placeholder="手机号">
          <template #prefix>
            <el-icon>
              <Iphone />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 验证码 -->
      <el-form-item prop="code">
        <div class="w-full flex justify-between">
          <el-input v-model.trim="loginFormData.code" placeholder="验证码">
            <template #prefix>
              <div class="i-svg:captcha" />
            </template>
          </el-input>
          <el-button :disabled="isDisabled" class="ml-2!" @click="sendCaptchaCode()">
            {{ countdown > 0 ? `${countdown}s后重新发送` : "发送验证码" }}
          </el-button>
        </div>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-form-item>
        <el-button :loading="loading" type="primary" class="w-full" @click="handleLoginSubmit">
          登录
        </el-button>
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" class="w-full" @click="toOtherForm('login')">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import type { FormInstance } from "element-plus";
import { LocationQuery, RouteLocationRaw, useRoute } from "vue-router";
import router from "@/router";
import { useUserStore } from "@/stores";
import { AuthAPI } from "@/api";
import { MobileLoginReq } from "@/api/types";
import { Iphone } from "@element-plus/icons-vue";

const userStore = useUserStore();
const route = useRoute();

const loginFormRef = ref<FormInstance>();
const loading = ref(false); // 按钮 loading 状态

const loginFormData = ref<MobileLoginReq>({} as MobileLoginReq);

const loginRules = computed(() => {
  return {
    mobile: [
      {
        required: true,
        trigger: "blur",
        message: "请输入手机号",
      },
      {
        pattern: /^1[3-9]\d{9}$/,
        trigger: "blur",
        message: "请输入正确的手机号格式",
      },
    ],
    code: [
      {
        required: true,
        trigger: "blur",
        message: "请输入短信验证码",
      },
    ],
  };
});

// 登录提交处理
async function handleLoginSubmit() {
  try {
    // 1. 表单验证
    const valid = await loginFormRef.value?.validate();
    if (!valid) return;

    loading.value = true;

    // 2. 执行登录
    await userStore.mobileLogin(loginFormData.value);

    // 3. 获取用户信息
    await userStore.getUserInfo();

    // 4. 解析并跳转目标地址
    const redirect = resolveRedirectTarget(route.query);
    await router.push(redirect);

    // TODO 5. 判断用户是否点击了记住我？采用明文保存或使用jsencrypt库？
  } catch (error) {
    // 5. 统一错误处理
    ElMessage.error("登录失败。" + error);
  } finally {
    loading.value = false;
  }
}

/**
 * 解析重定向目标
 * @param query 路由查询参数
 * @returns 标准化后的路由地址对象
 */
function resolveRedirectTarget(query: LocationQuery): RouteLocationRaw {
  // 默认跳转路径
  const defaultPath = "/";

  // 获取原始重定向路径
  const rawRedirect = (query.redirect as string) || defaultPath;

  try {
    // 6. 使用Vue Router解析路径
    const resolved = router.resolve(rawRedirect);
    return {
      path: resolved.path,
      query: resolved.query,
    };
  } catch {
    // 7. 异常处理：返回安全路径
    return { path: defaultPath };
  }
}

const emit = defineEmits(["update:modelValue"]);

function toOtherForm(type: string) {
  emit("update:modelValue", type);
}

// 获取验证码
const countdown = ref(0); // 倒计时秒数
const timer = ref<number | null>(null); // 定时器
const isDisabled = computed(() => {
  return countdown.value > 0 || !loginFormData.value.mobile;
});

function startCountdown() {
  countdown.value = 60;
  timer.value = window.setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0 && timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  }, 1000);
}

function sendCaptchaCode() {
  AuthAPI.sendMobileCode({
    mobile: loginFormData.value.mobile,
    type: "mobile_login",
  })
    .then(() => {
      ElMessage.success("验证码已发送，请注意查收");
      startCountdown();
    })
    .catch((error) => {
      ElMessage.error("发送验证码失败，请稍后重试。" + error.message);
    });
}
</script>
