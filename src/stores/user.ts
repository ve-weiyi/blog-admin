import { store } from "@/stores";

import { AuthAPI, MeAPI } from "@/api";
import type { LoginResp, UserProfile } from "@/api/types";

import { AuthStorage } from "@/utils/auth";
import { usePermissionStoreHook } from "@/stores/permission";
import { useDictStoreHook } from "@/stores/dict";
import { useTagsViewStore } from "@/stores";
import { setupSse, cleanupSseServices } from "@/composables/sse";

export const useUserStore = defineStore("user", () => {
  // 用户信息
  const userInfo = ref<UserProfile>({} as UserProfile);
  // 记住我状态
  const rememberMe = ref(AuthStorage.getRememberMe());

  /**
   * 登录
   */
  function login(loginData: {
    username: string;
    password: string;
    captchaId?: string;
    captchaCode?: string;
    rememberMe?: boolean;
  }) {
    return new Promise<LoginResp>((resolve, reject) => {
      AuthAPI.passwordLogin({
        account: loginData.username,
        password: loginData.password,
        captcha_key: loginData.captchaId,
        captcha_code: loginData.captchaCode,
      })
        .then((res) => {
          rememberMe.value = loginData.rememberMe ?? false;
          AuthStorage.setTokens(
            res.data.user_id ?? "",
            res.data.token?.access_token ?? "",
            res.data.token?.refresh_token ?? "",
            rememberMe.value
          );
          // 凭据已就位，立即建推送连接（否则要等重试间隔）
          setupSse();
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  let refreshPromise: Promise<void> | null = null;

  /**
   * 刷新 token（单飞模式）
   *
   * 多个并发请求遇到 token 过期时，共享同一次 refresh 请求。
   */
  function refreshTokenOnce(): Promise<void> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = doRefreshToken().finally(() => {
      refreshPromise = null;
    });

    return refreshPromise;
  }

  /**
   * 获取用户信息
   */
  function getUserInfo() {
    return new Promise<UserProfile>((resolve, reject) => {
      MeAPI.getMe()
        .then((res) => {
          if (!res) {
            reject("Verification failed, please Login again.");
            return;
          }
          Object.assign(userInfo.value, { ...res.data });
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 手机验证码登录
   */
  function mobileLogin(loginData: { mobile: string; code: string }) {
    return new Promise<LoginResp>((resolve, reject) => {
      AuthAPI.mobileLogin({
        mobile: loginData.mobile,
        code: loginData.code,
      })
        .then((res) => {
          rememberMe.value = false;
          AuthStorage.setTokens(
            res.data.user_id ?? "",
            res.data.token?.access_token ?? "",
            res.data.token?.refresh_token ?? "",
            false
          );
          // 凭据已就位，立即建推送连接（否则要等重试间隔）
          setupSse();
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 第三方登录（OAuth）
   */
  function thirdLogin(loginData: { platform: string; code: string }) {
    return new Promise<LoginResp>((resolve, reject) => {
      AuthAPI.oauthLogin({
        platform: loginData.platform,
        code: loginData.code,
      })
        .then((res) => {
          rememberMe.value = false;
          AuthStorage.setTokens(
            res.data.user_id ?? "",
            res.data.token?.access_token ?? "",
            res.data.token?.refresh_token ?? "",
            false
          );
          // 凭据已就位，立即建推送连接（否则要等重试间隔）
          setupSse();
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 登出
   */
  function logout() {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.logout()
        .then(() => {
          resetAllState();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 重置所有系统状态
   *
   * 统一处理所有清理工作，包括用户凭证、路由、缓存等
   */
  function resetAllState(): void {
    // 1. 重置用户状态
    resetUserState();

    // 2. 重置其他模块状态
    usePermissionStoreHook().resetRouter();
    useDictStoreHook().clearDictCache();
    useTagsViewStore().delAllViews();
  }

  /**
   * 重置用户状态
   *
   * 仅处理用户模块内的状态
   */
  function resetUserState(): void {
    AuthStorage.clearAuth();
    // 凭据已清，推送连接必须主动断开：否则它会带着旧令牌反复重连
    cleanupSseServices();
    userInfo.value = {} as UserProfile;
  }

  /**
   * 刷新 token
   */
  async function doRefreshToken(): Promise<void> {
    const currentRefreshToken = AuthStorage.getRefreshToken();

    if (!currentRefreshToken) {
      throw new Error("没有有效的刷新令牌");
    }

    const res = await AuthAPI.refreshToken({
      // 凭据只从 AuthStorage 读：userInfo 是异步回填的展示态缓存，
      // 硬刷新后为空，取它会让刷新请求缺 user_id 而必然失败
      user_id: AuthStorage.getUid(),
      grant_type: "refresh_token",
      refresh_token: currentRefreshToken,
    });

    const token = res.data?.token;
    if (!token || !token.access_token) {
      throw new Error("令牌刷新失败");
    }

    AuthStorage.setTokens(
      res.data.user_id || AuthStorage.getUid(),
      token.access_token,
      token.refresh_token ?? "",
      AuthStorage.getRememberMe()
    );
  }

  return {
    userInfo,
    rememberMe,
    isLoggedIn: () => !!AuthStorage.getAccessToken(),
    login,
    mobileLogin,
    thirdLogin,
    logout,
    getUserInfo,
    resetAllState,
    resetUserState,
    refreshToken: doRefreshToken,
    refreshTokenOnce,
  };
});

/**
 * 在组件外部使用 UserStore 的钩子函数
 *
 * @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
