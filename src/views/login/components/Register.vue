<template>
  <div>
    <h3 text-center m-0 mb-20px>注 册</h3>
    <el-form ref="formRef" :model="model" :rules="rules" size="large">
      <!-- 邮箱 -->
      <el-form-item prop="email">
        <el-input v-model.trim="model.email" placeholder="邮箱">
          <template #prefix>
            <el-icon>
              <Message />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-tooltip :visible="isCapsLock" content="大写锁定已打开" placement="right">
        <el-form-item prop="password">
          <el-input
            v-model.trim="model.password"
            placeholder="密码"
            type="password"
            show-password
            @keyup="checkCapsLock"
            @keyup.enter="submit"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-tooltip>

      <!-- 确认密码 -->
      <el-tooltip :visible="isCapsLock" content="大写锁定已打开" placement="right">
        <el-form-item prop="confirmPassword">
          <el-input
            v-model.trim="confirmPassword"
            placeholder="请再次确认密码"
            type="password"
            show-password
            @keyup="checkCapsLock"
            @keyup.enter="submit"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-tooltip>

      <!-- 验证码 -->
      <el-form-item prop="code">
        <div class="w-full flex justify-between">
          <el-input v-model.trim="model.code" placeholder="验证码" @keyup.enter="submit">
            <template #prefix>
              <div class="i-svg:captcha" />
            </template>
          </el-input>
          <el-button :disabled="isDisabled" class="ml-2!" @click="sendCaptchaCode()">
            {{ countdown > 0 ? `${countdown}s后重新发送` : "发送验证码" }}
          </el-button>
        </div>
      </el-form-item>

      <el-form-item>
        <div class="flex-y-center w-full gap-10px">
          <el-checkbox v-model="isRead">我已同意并阅读</el-checkbox>
          <el-link type="primary" underline="never">用户协议</el-link>
        </div>
      </el-form-item>

      <!-- 注册按钮 -->
      <el-form-item>
        <el-button :loading="loading" type="success" class="w-full" @click="submit">
          注 册
        </el-button>
      </el-form-item>
    </el-form>
    <div flex-center gap-10px>
      <el-text size="default">已有账号？</el-text>
      <el-link type="primary" underline="never" @click="toLogin">登 录</el-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { Lock, Message } from "@element-plus/icons-vue";
import { RegisterReq } from "@/api/types";
import { AuthAPI } from "@/api";

const emit = defineEmits(["update:modelValue"]);
const toLogin = () => emit("update:modelValue", "login");

const formRef = ref<FormInstance>();
const loading = ref(false); // 按钮 loading 状态
const isCapsLock = ref(false); // 是否大写锁定
const isRead = ref(false);

const model = ref<RegisterReq>({} as RegisterReq);
const confirmPassword = ref("");

const rules = computed<FormRules>(() => {
  return {
    email: [
      {
        required: true,
        trigger: "blur",
        message: "请输入邮箱",
      },
      {
        type: "email",
        trigger: "blur",
        message: "请输入正确的邮箱格式",
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: "请输入密码",
      },
      {
        min: 6,
        message: "密码不能少于6位",
        trigger: "blur",
      },
    ],
    confirmPassword: [
      {
        required: true,
        trigger: "blur",
        message: "请输入密码",
      },
      {
        min: 6,
        message: "密码不能少于6位",
        trigger: "blur",
      },
      {
        validator: (rule: any, value: any, callback: any) => {
          if (value === "") {
            callback(new Error("请输入密码"));
          } else if (value !== model.value.password) {
            callback(new Error("两次密码输入不一致"));
          } else {
            callback();
          }
        },
        trigger: "blur",
        message: "两次密码输入不一致",
      },
    ],
    code: [
      {
        required: true,
        trigger: "blur",
        message: "请输入验证码",
      },
    ],
  };
});

// 获取验证码
const countdown = ref(0); // 倒计时秒数
const timer = ref<number | null>(null); // 定时器
const isDisabled = computed(() => {
  return countdown.value > 0 || !model.value.email;
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
  AuthAPI.sendEmailCode({
    email: model.value.email,
    type: "register",
  })
    .then(() => {
      ElMessage.success("验证码已发送到您的邮箱，请注意查收");
      startCountdown();
    })
    .catch((error) => {
      ElMessage.error("验证码发送失败：" + error.message);
    });
}

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});

// 检查输入大小写
function checkCapsLock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  if (event instanceof KeyboardEvent) {
    isCapsLock.value = event.getModifierState("CapsLock");
  }
}

const submit = async () => {
  if (!isRead.value) {
    ElMessage.warning("请先阅读并同意用户协议");
    return;
  }
  await formRef.value?.validate();
  loading.value = true;
  AuthAPI.register({
    username: model.value.email,
    ...model.value,
  })
    .then(() => {
      ElMessage.success("注册成功");
      toLogin();
    })
    .catch((error) => {
      ElMessage.error("注册失败：" + error.message);
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
