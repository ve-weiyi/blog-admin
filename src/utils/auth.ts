import { Storage } from "./storage";
import { STORAGE_KEYS, ROLE_ROOT } from "@/constants";
import { useUserStoreHook } from "@/stores/user";
import router from "@/router";

// 应用标识，随请求头下发
export const APP_NAME = "blog";

// 负责本地凭证与偏好的读写
export const AuthStorage = {
  getAccessToken(): string {
    const isRememberMe = Storage.get<boolean>(STORAGE_KEYS.REMEMBER_ME, false);
    return isRememberMe
      ? Storage.get(STORAGE_KEYS.ACCESS_TOKEN, "")
      : Storage.sessionGet(STORAGE_KEYS.ACCESS_TOKEN, "");
  },

  getRefreshToken(): string {
    const isRememberMe = Storage.get<boolean>(STORAGE_KEYS.REMEMBER_ME, false);
    return isRememberMe
      ? Storage.get(STORAGE_KEYS.REFRESH_TOKEN, "")
      : Storage.sessionGet(STORAGE_KEYS.REFRESH_TOKEN, "");
  },

  setTokens(uid: string, accessToken: string, refreshToken: string, rememberMe: boolean): void {
    Storage.set(STORAGE_KEYS.REMEMBER_ME, rememberMe);
    if (rememberMe) {
      Storage.set(STORAGE_KEYS.UID, uid);
      Storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      Storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    } else {
      Storage.sessionSet(STORAGE_KEYS.UID, uid);
      Storage.sessionSet(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      Storage.sessionSet(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      Storage.remove(STORAGE_KEYS.UID);
      Storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
      Storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    }
  },

  clearAuth(): void {
    Storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    Storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    Storage.remove(STORAGE_KEYS.UID);
    Storage.sessionRemove(STORAGE_KEYS.UID);
    Storage.sessionRemove(STORAGE_KEYS.ACCESS_TOKEN);
    Storage.sessionRemove(STORAGE_KEYS.REFRESH_TOKEN);
  },

  getRememberMe(): boolean {
    return Storage.get<boolean>(STORAGE_KEYS.REMEMBER_ME, false);
  },

  setRememberMe(value: boolean): void {
    Storage.set(STORAGE_KEYS.REMEMBER_ME, value);
  },

  getUid(): string {
    const isRememberMe = Storage.get<boolean>(STORAGE_KEYS.REMEMBER_ME, false);
    return isRememberMe
      ? Storage.get(STORAGE_KEYS.UID, "")
      : Storage.sessionGet(STORAGE_KEYS.UID, "");
  },

  setUid(uid: string, rememberMe: boolean): void {
    if (rememberMe) {
      Storage.set(STORAGE_KEYS.UID, uid);
    } else {
      Storage.sessionSet(STORAGE_KEYS.UID, uid);
      Storage.remove(STORAGE_KEYS.UID);
    }
  },

  getDeviceId(): string {
    const isRememberMe = Storage.get<boolean>(STORAGE_KEYS.REMEMBER_ME, false);
    return isRememberMe
      ? Storage.get(STORAGE_KEYS.DEVICE_ID, "")
      : Storage.sessionGet(STORAGE_KEYS.DEVICE_ID, "");
  },

  setDeviceId(did: string): void {
    const isRememberMe = Storage.get<boolean>(STORAGE_KEYS.REMEMBER_ME, false);
    if (isRememberMe) {
      Storage.set(STORAGE_KEYS.DEVICE_ID, did);
    } else {
      Storage.sessionSet(STORAGE_KEYS.DEVICE_ID, did);
      Storage.remove(STORAGE_KEYS.DEVICE_ID);
    }
  },
};

/**
 * 权限判断
 */
export function hasPerm(value: string | string[], type: "button" | "role" = "button"): boolean {
  const { roles, perms } = useUserStoreHook().userInfo;

  if (!roles || !perms) {
    return false;
  }

  // 超级管理员拥有所有权限
  if (type === "button" && roles.includes(ROLE_ROOT)) {
    return true;
  }

  const auths = type === "button" ? perms : roles;
  return typeof value === "string"
    ? auths.includes(value)
    : value.some((perm) => auths.includes(perm));
}

let redirectingToLogin = false;

/**
 * 重定向到登录页面
 */
export async function redirectToLogin(
  message: string = "请重新登录",
  notify: boolean = true
): Promise<void> {
  if (redirectingToLogin) return;
  redirectingToLogin = true;

  if (notify) {
    ElNotification({
      title: "提示",
      message,
      type: "warning",
      duration: 3000,
    });
  }

  await useUserStoreHook().resetAllState();

  try {
    // 跳转到登录页，保留当前路由用于登录后跳转
    const currentPath = router.currentRoute.value.fullPath;
    await router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  } catch (error) {
    console.error("Redirect to login error:", error);
    // 强制跳转，即使路由重定向失败
    window.location.href = "/login";
  } finally {
    redirectingToLogin = false;
  }
}
