import type { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "@/router";
import { store } from "@/stores";
import router from "@/router";
import { useUserStoreHook } from "@/stores/user";

import { MeAPI } from "@/api";
import type { UserMenu } from "@/api/types";
const modules = import.meta.glob("../views/**/**.vue");
const routeModules = import.meta.glob("../router/admin/*.ts", { eager: true });
const Layout = () => import("../layouts/index.vue");

function resolveViewComponent(componentPath: string) {
  const normalized = componentPath
    .trim()
    .replace(/^\/+/, "")
    .replace(/\.vue$/i, "");
  return (
    modules[`../views/${normalized}.vue`] ||
    modules[`../views/${normalized}/index.vue`] ||
    modules[`../views/error/404.vue`]
  );
}

export const usePermissionStore = defineStore("permission", () => {
  // 所有路由（静态路由 + 动态路由）
  const routes = ref<RouteRecordRaw[]>([]);
  // 混合布局的左侧菜单路由
  const mixLayoutSideMenus = ref<RouteRecordRaw[]>([]);
  // 动态路由是否已生成
  const isRouteGenerated = ref(false);

  /** 生成动态路由 */
  async function generateRoutes(): Promise<RouteRecordRaw[]> {
    try {
      const res = await MeAPI.getMeMenus();
      const menuList = res.data?.list;

      const dynamicRoutes =
        import.meta.env.VITE_ENABLE_DEV_MODE === "true" || !menuList || menuList.length === 0
          ? getMockRoutes()
          : transformRoutes(menuList);

      routes.value = [...constantRoutes, ...dynamicRoutes];
      isRouteGenerated.value = true;

      return dynamicRoutes;
    } catch (error) {
      isRouteGenerated.value = false;
      throw error;
    }
  }

  /** 设置混合布局左侧菜单 */
  const setMixLayoutSideMenus = (parentPath: string) => {
    const parentMenu = routes.value.find((item: RouteRecordRaw) => item.path === parentPath);
    mixLayoutSideMenus.value = parentMenu?.children || [];
  };

  /** 重置路由状态 */
  const resetRouter = () => {
    // 移除动态添加的路由
    const constantRouteNames = new Set(constantRoutes.map((route) => route.name).filter(Boolean));
    routes.value.forEach((route) => {
      if (route.name && !constantRouteNames.has(route.name)) {
        router.removeRoute(route.name);
      }
    });

    // 重置所有状态
    routes.value = [...constantRoutes];
    mixLayoutSideMenus.value = [];
    isRouteGenerated.value = false;
  };

  let reloadPromise: Promise<RouteRecordRaw[]> | null = null;

  /**
   * 重新加载动态路由（单飞）。
   *
   * 典型场景：后端权限变更导致接口返回权限不足（A0301），前端需要刷新路由和菜单以同步最新权限。
   *
   * - 会先清理已注册的动态路由（resetRouter）
   * - 重新从后端拉取路由（generateRoutes）
   * - 将动态路由注册到 vue-router（router.addRoute）
   */
  async function reloadDynamicRoutesOnce(): Promise<RouteRecordRaw[]> {
    if (reloadPromise) return reloadPromise;

    reloadPromise = (async () => {
      try {
        resetRouter();
        const dynamicRoutes = await generateRoutes();
        dynamicRoutes.forEach((route: RouteRecordRaw) => {
          router.addRoute(route);
        });
        return dynamicRoutes;
      } finally {
        reloadPromise = null;
      }
    })();

    return reloadPromise;
  }

  let snapshotPromise: Promise<void> | null = null;

  /**
   * 刷新权限快照（单飞）。
   *
   * - 刷新用户信息（包含 perms/roles 等）
   * - 重新加载动态路由
   */
  async function reloadPermissionSnapshotOnce(): Promise<void> {
    if (snapshotPromise) return snapshotPromise;

    snapshotPromise = (async () => {
      try {
        const userStore = useUserStoreHook();
        await userStore.getUserInfo();
        await reloadDynamicRoutesOnce();
      } finally {
        snapshotPromise = null;
      }
    })();

    return snapshotPromise;
  }

  const getMockRoutes = (): RouteRecordRaw[] => {
    return Object.values(routeModules)
      .map((module) => (module as any).default)
      .filter((route) => route)
      .sort((a, b) => {
        const rankA = a.meta?.rank || 999;
        const rankB = b.meta?.rank || 999;
        return rankA - rankB;
      });
  };

  return {
    routes,
    mixLayoutSideMenus,
    isRouteGenerated,
    generateRoutes,
    getMockRoutes,
    setMixLayoutSideMenus,
    resetRouter,
    reloadDynamicRoutesOnce,
    reloadPermissionSnapshotOnce,
  };
});

/**
 * 转换后端路由数据为Vue Router配置
 * 处理组件路径映射和Layout层级嵌套
 */
const transformRoutes = (routes: UserMenu[], isTopLevel: boolean = true): RouteRecordRaw[] => {
  return routes.map((route) => {
    const { component, children, meta } = route;

    // 处理组件：顶层或非Layout保留组件，中间层Layout设为undefined
    const processedComponent = isTopLevel || component !== "Layout" ? component : undefined;

    const normalizedRoute: RouteRecordRaw = {
      path: route.path,
      name: route.name,
      redirect: route.redirect,
    };

    if (meta) {
      normalizedRoute.meta = meta as any;
    }

    if (!processedComponent) {
      // 多级菜单的父级菜单，不需要组件
      (normalizedRoute as any).component = undefined;
    } else {
      // 动态导入组件，Layout特殊处理，找不到组件时返回404
      (normalizedRoute as any).component =
        processedComponent === "Layout" ? Layout : resolveViewComponent(processedComponent);
    }

    // 递归处理子路由
    if (children && children.length > 0) {
      normalizedRoute.children = transformRoutes(children, false);
    }

    return normalizedRoute;
  });
};

/** 非组件环境使用权限store */
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
