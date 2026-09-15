<div align="center">
  <img alt="blog-admin" width="64" height="64" src="./public/favicon.ico">
  <h1>blog-admin</h1>
  <p>🖥️ 基于 Vue 3 + Element Plus 的现代化博客后台管理</p>

  <img src="https://img.shields.io/badge/Vue-3.5-brightgreen?logo=vuedotjs" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-8.0-purple?logo=vite" />
  <img src="https://img.shields.io/badge/Pinia-3.0-yellow?logo=vuedotjs" />
  <img src="https://img.shields.io/badge/Element_Plus-2.14-blue?logo=element" />
  <img src="https://img.shields.io/badge/UnoCSS-66.7-red" />
</div>

<br/>

<div align="center">

  <a target="_blank" href="https://admin.veweiyi.cn">
    <img src="https://img.shields.io/badge/🖥️_在线预览-管理后台-e74c3c?style=for-the-badge" />
  </a>
  <br/>
  <a target="_blank" href="https://admin.veweiyi.cn/admin-api/v1/swagger/index.html">📑 接口文档</a>
</div>

<br/>

## 📚 项目简介

blog-admin 是 blog 博客系统的管理后台项目，基于 Vue 3 + TypeScript + Element Plus 构建。覆盖内容管理、权限控制、数据统计、系统配置等完整的后台管理功能，配套 Husky + Commitlint 规范化的工程体系。

### ✨ 核心亮点

- 🖥️ **企业级后台体验** — Element Plus 组件库 + 精心设计的布局，CRUD 操作高效流畅
- 🔐 **精细化权限控制** — RBAC 角色权限 + 动态路由 + 按钮级鉴权，权限粒度到操作
- 📝 **双编辑器支持** — Markdown 编辑器（md-editor-v3）+ 富文本，满足不同内容场景
- 📊 **数据可视化** — ECharts 6 图表，首页仪表盘 + 访问统计 + 操作日志一目了然
- 🛠️ **规范化工程体系** — Husky + Commitlint + ESLint + Prettier，代码质量有保障
- 🔌 **即插即用** — 基于 vue3-element-template 二次开发，页面和组件模块化，快速扩展

## 🛠️ 技术栈

| 技术 | 说明 | 版本 |
|------|------|------|
| Vue 3 | 渐进式框架 | 3.5 |
| TypeScript | 类型安全 | 5.9 |
| Vite | 构建工具 | 8.0 |
| Element Plus | UI 组件库 | 2.14 |
| Pinia | 状态管理 | 3.0 |
| UnoCSS | 原子化 CSS | 66.7 |
| Vue Router | 路由管理 | 5.1 |
| Axios | HTTP 请求 | 1.18 |
| ECharts | 数据可视化 | 6.1 |
| md-editor-v3 | Markdown 编辑器 | 6.5 |

## 🎯 后台功能

| 模块 | 功能 | 状态 |
|------|------|:--:|
| 📝 内容管理 | 文章 CRUD、分类标签管理、回收站 | ✅ |
| 💬 评论消息 | 评论审核、留言管理 | ✅ |
| 🖼️ 资源管理 | 相册管理、文件上传、图片预览 | ✅ |
| 👥 社交管理 | 友链审核、说说管理 | ✅ |
| 🔐 系统管理 | 用户管理、角色权限、菜单路由、API 管理 | ✅ |
| 🌐 网站管理 | 站点配置、关于页面、统计看板 | ✅ |
| 📊 日志审计 | 登录日志、操作日志、访问日志、文件日志 | ✅ |
| 🔔 消息通知 | 通知模板、消息记录、站内推送 | ✅ |
| 🏠 仪表盘 | 数据看板、ECharts 图表 | ✅ |
| 🛠️ 开发工具 | Swagger 文档集成、WebSocket 调试 | ✅ |

## 📁 项目源码

| 项目 | 说明 | 仓库 |
|------|------|------|
| blog-cloud | 博客后端（go-zero 微服务版） | [GitHub](https://github.com/ve-weiyi/blog-cloud) |
| blog-gin | 博客后端（Gin 单体版） | [GitHub](https://github.com/ve-weiyi/blog-gin) |
| blog-app | 博客前台 | [GitHub](https://github.com/ve-weiyi/blog-app) |
| blog-admin | 博客后台 | [GitHub](https://github.com/ve-weiyi/blog-admin) |

## 🏗️ 项目结构

```
blog-admin/
├── src/
│   ├── api/              # API 接口定义（由 goctlx 从 .api 生成）
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   ├── composables/      # 组合式函数（含 SSE）
│   ├── config/           # 应用配置
│   ├── constants/        # 常量
│   ├── directives/       # 自定义指令
│   ├── enums/            # 枚举
│   ├── hooks/            # 组合函数
│   ├── layouts/          # 布局组件
│   ├── plugins/          # 插件初始化
│   ├── router/           # 路由配置（动态路由）
│   ├── stores/           # Pinia 状态管理
│   ├── styles/           # 全局样式
│   ├── utils/            # 工具函数
│   └── views/            # 页面组件（按功能模块分目录）
├── types/                # 全局 TypeScript 声明
├── mock/                 # Mock 数据，文件名与 src/api 分组一一对应
├── public/               # 公共静态资源
├── docs/                 # 项目文档
└── vite.config.ts        # Vite 配置
```

## ⚙️ 环境要求

- **Node.js**: `^20.19.0 || >=22.12.0`
- **pnpm**: >= 9

## 🚀 快速开始

```bash
# 1. 克隆 & 安装
git clone https://github.com/ve-weiyi/blog-admin.git && cd blog-admin
pnpm install

# 2. 启动开发服务器
pnpm dev                     # → http://localhost:9521
```

三种模式按接口来源区分：

| 命令 | 接口来源 | 需要后端 | 用途 |
|------|---------|:-------:|------|
| `pnpm dev` | mock | 否 | 纯前端开发 |
| `pnpm test` | 本地后端 `:9421` | 是 | 前后端联调 |
| `pnpm preview` | 构建产物 + mock | 否 | 预览打包结果 |

> `pnpm preview` 的 mock 由 `vite preview` 的服务端中间件承接，只在本地生效；
> 构建产物直接托管到 nginx 不会带 mock。

## 🐳 Docker 部署

```bash
# 在 monorepo 根目录执行
docker build -f deploy/docker/frontend/Dockerfile \
  --build-arg DIST_DIR=dist/admin \
  --build-arg PROXY_PASS=admin.veweiyi.cn \
  -t blog-admin-web:latest ./blog-admin
docker run -d --name blog-admin-web --restart always -p 9521:80 blog-admin-web:latest

# 或使用 Docker Compose
docker compose -f deploy/docker/docker-compose.yml up -d admin-web
```

## 📈 开发路线

### 已完成 ✅
- [x] 文章管理（CRUD + 回收站 + Markdown / 富文本编辑）
- [x] 分类 / 标签管理
- [x] 评论审核 + 留言管理
- [x] 相册 + 文件上传管理
- [x] 友链 + 说说管理
- [x] 用户管理 + 角色权限（RBAC）
- [x] 动态菜单 / 路由 + 按钮级鉴权
- [x] 站点配置 + 关于页面
- [x] 登录 / 操作 / 访问 / 文件日志审计
- [x] 通知模板 + 消息推送
- [x] 仪表盘数据看板（ECharts）
- [x] API 管理 + Swagger 集成
- [x] WebSocket 调试工具
- [x] Husky + Commitlint 提交规范
- [x] Mock 数据独立开发

### 进行中 🚧
- [ ] 多语言国际化
- [ ] 首页布局优化

### 计划中 📋
- [ ] 单元测试 + E2E 测试
- [ ] 主题换肤
- [ ] Excel 批量导入导出

## 🤝 参与贡献

1. Fork 本仓库
2. 创建分支：`git checkout -b feature/your-feature`
3. 提交：`git commit -m 'feat: 添加某功能'`
4. 推送：`git push origin feature/your-feature`
5. 提交 Pull Request

提交规范遵循 [Conventional Commits](https://www.conventionalcommits.org/)：
`feat:` / `fix:` / `docs:` / `refactor:` / `style:` / `test:` / `chore:`

## 📄 开源协议

MIT License — 可自由使用、修改和分发。

---

<div align="center">
  <p>如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！</p>
  <p>Made with ❤️ by <a href="https://github.com/ve-weiyi">ve-weiyi</a></p>
</div>
