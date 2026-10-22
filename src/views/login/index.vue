<template>
  <div class="login-page">
    <div class="login-page__toolbar">
      <el-tooltip content="主题切换" placement="bottom">
        <div class="toolbar-item">
          <ThemeSwitch />
        </div>
      </el-tooltip>
      <el-tooltip content="语言切换" placement="bottom">
        <div class="toolbar-item">
          <LangSelect size="text-20px" />
        </div>
      </el-tooltip>
    </div>

    <div class="login-page__body">
      <section class="login-hero">
        <div class="login-hero__badge">
          <span class="login-hero__dot" />
          Blog Management System
        </div>
        <h1 class="login-hero__title">博客管理系统</h1>
        <p class="login-hero__subtitle">
          基于 Vue 3 + TypeScript 构建的现代化博客管理平台，提供优雅的写作体验和强大的内容管理能力。
        </p>
        <ul class="login-hero__features">
          <li>
            <span>✓</span>
            多种登录方式灵活切换
          </li>
          <li>
            <span>✓</span>
            角色权限与安全管控
          </li>
          <li>
            <span>✓</span>
            文章分类与标签管理
          </li>
          <li>
            <span>✓</span>
            评论互动与访客统计
          </li>
        </ul>
      </section>

      <section class="login-card">
        <div class="login-card__brand">
          <div class="login-card__logo-wrap">
            <el-image :src="logo" class="login-card__logo" />
          </div>
          <div class="login-card__meta">
            <div class="login-card__title-row">
              <span class="login-card__title">{{ appConfig.title }}</span>
            </div>
            <div v-if="appConfig.version" class="login-card__version-row">
              <el-text size="small" type="info">VERSION</el-text>
              <el-tag v-if="appConfig.version" size="small" effect="light" round>
                {{ `v${appConfig.version}` }}
              </el-tag>
            </div>
          </div>
        </div>

        <div style="min-height: 450px">
          <transition name="fade-slide" mode="out-in">
            <component
              :is="formComponents[component]"
              v-model="component"
              class="login-card__form"
            />
          </transition>
        </div>

        <footer class="login-card__footer">
          <el-text size="small">
            Copyright © 2022 - 2025 与梦
            <a href="http://beian.miit.gov.cn/" target="_blank">桂ICP备2023013735号-1</a>
          </el-text>
        </footer>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from "@/assets/images/logo.png";
import { appConfig } from "@/settings";
import ThemeSwitch from "@/components/ThemeSwitch/index.vue";
import LangSelect from "@/components/LangSelect/index.vue";

type LayoutMap = "login" | "register" | "resetPwd" | "phone_login";

const component = ref<LayoutMap>("login");

const formComponents = {
  login: defineAsyncComponent(() => import("./components/Login.vue")),
  register: defineAsyncComponent(() => import("./components/Register.vue")),
  resetPwd: defineAsyncComponent(() => import("./components/ResetPwd.vue")),
  phone_login: defineAsyncComponent(() => import("./components/PhoneLogin.vue")),
};

let notificationInstance: ReturnType<typeof ElNotification> | null = null;

const showVoteNotification = () => {
  notificationInstance = ElNotification({
    title: "欢迎使用博客管理系统",
    message: `
开始你的创作之旅，记录生活点滴，分享技术心得~
<br/>
<a href="https://app.veweiyi.cn" target="_blank" style="color: var(--el-color-primary); text-decoration: none; font-weight: 500;">📖 访问博客前台</a>
<br/>
<a href="https://admin.veweiyi.cn" target="_blank" style="color: var(--el-color-primary); text-decoration: none; font-weight: 500;">⚙️ 进入管理后台</a>
`,
    type: "success",
    position: "bottom-left",
    duration: 0,
    dangerouslyUseHTMLString: true,
  });
};

onMounted(() => {
  setTimeout(showVoteNotification, 500);
});

onBeforeUnmount(() => {
  if (notificationInstance) {
    notificationInstance.close();
    notificationInstance = null;
  }
});
</script>

<style lang="scss" scoped>
.login-page {
  --login-hero-text: #1a1a2e;
  --login-hero-sub: #6b7280;
  --login-card-bg: rgb(255 255 255 / 90%);
  --login-card-border: rgb(0 0 0 / 6%);

  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: clamp(1rem, 3vw, 2rem);
  overflow: hidden;
  background: #f5f8ff;

  &::before {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    content: "";
    background: url("@/assets/images/login/bg.svg") center/cover no-repeat;
  }
}

.dark .login-page {
  --login-hero-text: #e4e8f0;
  --login-hero-sub: #8893a8;
  --login-card-bg: rgb(22 26 36 / 90%);
  --login-card-border: rgb(255 255 255 / 7%);

  background: #0b0f19;

  &::before {
    background-image: url("@/assets/images/login/bg-dark.svg");
  }
}

.login-page__toolbar {
  position: relative;
  z-index: 1;
  display: inline-flex;
  gap: 8px;
  align-self: flex-end;
  padding: 6px 10px;
  background: var(--login-card-bg);
  border: 1px solid var(--login-card-border);
  border-radius: 999px;
  backdrop-filter: blur(8px);

  .toolbar-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    cursor: pointer;
    border-radius: 8px;
    transition: background 0.2s;

    &:hover {
      background: var(--el-fill-color);
    }
  }

  @media (max-width: 640px) {
    position: fixed;
    top: 12px;
    right: 16px;
    z-index: 20;
  }
}

.login-page__body {
  position: relative;
  z-index: 1;
  display: grid;
  flex: 1;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(2rem, 4vw, 4rem);
  align-items: stretch;
  padding: clamp(1.5rem, 2vw, 2.5rem);
}

.login-hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(1rem, 2vw, 2rem);
  color: var(--login-hero-text);
  animation: heroIn 0.8s ease-out;
}

.login-hero__badge {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  width: fit-content;
  padding: 5px 12px;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--el-color-primary);
  letter-spacing: 0.06em;
  background: var(--el-color-primary-light-9);
  border-radius: 999px;
}

.login-hero__dot {
  width: 7px;
  height: 7px;
  background: var(--el-color-primary);
  border-radius: 50%;
}

.login-hero__title {
  margin: 1.25rem 0 0.5rem;
  font-size: clamp(1.75rem, 3.5vw, 2.25rem);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.login-hero__subtitle {
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--login-hero-sub);
}

.login-hero__features {
  display: grid;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;

  li {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 10px 14px;
    font-size: 0.9rem;
    font-weight: 500;
    background: var(--login-card-bg);
    border: 1px solid var(--login-card-border);
    border-radius: 10px;
    backdrop-filter: blur(4px);

    span {
      flex-shrink: 0;
      font-weight: 700;
      color: var(--el-color-primary);
    }
  }
}

.login-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-self: center;
  justify-self: end;
  width: min(420px, 100%);
  padding: clamp(1.5rem, 3vw, 2.25rem);
  margin-inline: auto;
  background: var(--login-card-bg);
  border: 1px solid var(--login-card-border);
  border-radius: 20px;
  box-shadow:
    0 2px 4px rgb(0 0 0 / 2%),
    0 12px 32px rgb(0 0 0 / 6%);
  backdrop-filter: blur(16px);
  animation: cardIn 0.7s ease;
}

.login-card__brand {
  display: flex;
  gap: 12px;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--login-card-border);
}

.login-card__logo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  background: var(--el-color-primary-light-9);
  border-radius: 14px;
}

.login-card__logo {
  width: 26px;
  height: 26px;
}

.login-card__meta {
  flex: 1;
  min-width: 0;
}

.login-card__title {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.05rem;
  font-weight: 650;
  white-space: nowrap;
}

.login-card__version-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 2px;
  font-size: 0.72rem;
}

.login-card__form {
  width: 100%;
  max-width: 100%;
  margin-inline: auto;

  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-input__wrapper) {
    background: rgb(0 0 0 / 2%);
    border-radius: 10px;
    box-shadow: 0 0 0 1px rgb(0 0 0 / 6%) inset;
    transition: all 0.2s;

    &:hover {
      box-shadow: 0 0 0 1px rgb(0 0 0 / 10%) inset;
    }

    &.is-focus {
      background: transparent;
      box-shadow: 0 0 0 1.5px var(--el-color-primary) inset;
    }
  }
}

.dark .login-card__form {
  :deep(.el-input__wrapper) {
    background: rgb(255 255 255 / 3%);
    box-shadow: 0 0 0 1px rgb(255 255 255 / 8%) inset;

    &:hover {
      box-shadow: 0 0 0 1px rgb(255 255 255 / 14%) inset;
    }

    &.is-focus {
      background: rgb(255 255 255 / 5%);
      box-shadow: 0 0 0 1.5px var(--el-color-primary) inset;
    }
  }
}

.login-card__footer {
  padding-top: 14px;
  font-size: 0.78rem;
  color: var(--el-text-color-placeholder);
  text-align: center;
  border-top: 1px solid var(--login-card-border);

  a {
    margin-left: 4px;
    color: var(--el-text-color-secondary);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--el-color-primary);
    }
  }
}

@media (max-width: 768px) {
  .login-page__body {
    display: block;
    padding: 0.5rem;
  }

  .login-hero {
    display: none;
  }
}

@keyframes heroIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
