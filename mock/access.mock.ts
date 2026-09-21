import { defineMock } from "./base";

const baseTime = 1700000000000;

const ok = (data: unknown) => ({ code: "SUCCESS", data, message: "ok" });

const batch = (n = 1) => ok({ success_count: n });

/** 模拟用户 */

const mockApis = [
  {
    id: 1,
    parent_id: 0,
    name: "系统管理",
    path: "",
    method: "",
    traceable: 0,
    status: 0,
    created_at: baseTime,
    updated_at: baseTime,
    children: [
      {
        id: 101,
        parent_id: 1,
        name: "用户查询",
        path: "/admin-api/v1/user/query_user_list",
        method: "POST",
        traceable: 0,
        status: 0,
        created_at: baseTime,
        updated_at: baseTime,
        children: [],
      },
      {
        id: 102,
        parent_id: 1,
        name: "角色查询",
        path: "/admin-api/v1/role/query_role_list",
        method: "POST",
        traceable: 0,
        status: 0,
        created_at: baseTime,
        updated_at: baseTime,
        children: [],
      },
    ],
  },
];

const mockMenus = [
  {
    id: 1,
    parent_id: 0,
    path: "/system",
    name: "System",
    component: "Layout",
    redirect: "/system/user",
    type: "CATALOG",
    title: "系统管理",
    icon: "el-icon-setting",
    rank: 5,
    perm: "",
    keep_alive: 1,
    always_show: 0,
    visible: 1,
    status: 0,
    created_at: baseTime,
    updated_at: baseTime,
    children: [
      {
        id: 101,
        parent_id: 1,
        path: "/system/user",
        name: "User",
        component: "admin/system/user/User",
        redirect: "",
        type: "MENU",
        title: "用户管理",
        icon: "el-icon-user",
        rank: 1,
        perm: "sys:user:query",
        keep_alive: 1,
        always_show: 0,
        visible: 1,
        status: 0,
        created_at: baseTime,
        updated_at: baseTime,
        children: [],
      },
      {
        id: 102,
        parent_id: 1,
        path: "/system/role",
        name: "Role",
        component: "admin/system/role/Role",
        redirect: "",
        type: "MENU",
        title: "角色管理",
        icon: "el-icon-role",
        rank: 2,
        perm: "sys:role:query",
        keep_alive: 1,
        always_show: 0,
        visible: 1,
        status: 0,
        created_at: baseTime,
        updated_at: baseTime,
        children: [],
      },
    ],
  },
];

/** 模拟接口权限（树形） */

const mockRoles = [
  {
    id: 1,
    parent_id: 0,
    role_key: "ROOT",
    role_label: "超级管理员",
    role_comment: "拥有全部权限",
    is_default: 1,
    status: 0,
    created_at: baseTime,
    updated_at: baseTime,
  },
  {
    id: 2,
    parent_id: 0,
    role_key: "EDITOR",
    role_label: "内容编辑",
    role_comment: "负责内容维护",
    is_default: 0,
    status: 0,
    created_at: baseTime,
    updated_at: baseTime,
  },
];

/** 模拟菜单（树形） */

export default defineMock([
  {
    url: "apis",
    method: ["GET"],
    body: ok({ list: mockApis, total: mockApis.length }),
  },
  { url: "apis", method: ["POST"], body: ok(mockApis[0]) },
  { url: "apis/:id", method: ["PUT"], body: ok(mockApis[0]) },
  { url: "apis/batch-delete", method: ["POST"], body: batch() },
  { url: "apis/clean", method: ["POST"], body: ok({ success_count: 2 }) },
  { url: "apis/sync", method: ["POST"], body: ok({ success_count: 2 }) },
  {
    url: "menus",
    method: ["GET"],
    body: ok({ list: mockMenus, total: mockMenus.length }),
  },
  { url: "menus", method: ["POST"], body: ok(mockMenus[0]) },
  { url: "menus/:id", method: ["PUT"], body: ok(mockMenus[0]) },
  { url: "menus/batch-delete", method: ["POST"], body: batch() },
  { url: "menus/clean", method: ["POST"], body: ok({ success_count: 2 }) },
  { url: "menus/sync", method: ["POST"], body: ok({ success_count: 2 }) },
  {
    url: "roles",
    method: ["GET"],
    body: ok({ list: mockRoles, total: mockRoles.length }),
  },
  {
    url: "roles/:role_id/permissions",
    method: ["GET"],
    body: ok({ role_id: 1, api_ids: [101, 102], menu_ids: [1, 101, 102] }),
  },
  { url: "roles", method: ["POST"], body: ok(mockRoles[0]) },
  { url: "roles/:id", method: ["PUT"], body: ok(mockRoles[0]) },
  { url: "roles/batch-delete", method: ["POST"], body: batch() },
  { url: "roles/:role_id/apis", method: ["PUT"], body: ok({}) },
  { url: "roles/:role_id/menus", method: ["PUT"], body: ok({}) },
]);
