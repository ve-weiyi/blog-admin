// ==================== 文章 (Article) ====================

/** 文章状态枚举 */
export enum ArticleStatusEnum {
  ALL = 0, // 全部
  PUBLIC = 1, // 公开
  PRIVATE = 2, // 私密
  DRAFT = 3, // 草稿
}

/** 文章类型枚举 */
export enum ArticleTypeEnum {
  ALL = null as any, // 全部
  ORIGINAL = 1, // 原创
  REPRINT = 2, // 转载
  TRANSLATE = 3, // 翻译
}

/** 文章置顶枚举 */
export enum ArticleTopEnum {
  ALL = -1, // 全部
  NO = 2, // 不置顶
  YES = 1, // 置顶
}

/** 文章删除枚举 */
export enum ArticleDeleteEnum {
  ALL = -1, // 全部
  NO = 0, // 未删除
  YES = 1, // 删除
}

// ==================== 说说 (Talk) ====================

/** 说说状态枚举 */
export enum TalkStatusEnum {
  ALL = null as any, // 全部
  PUBLIC = 1, // 公开
  PRIVATE = 2, // 私密
}

/** 说说置顶枚举 */
export enum TalkTopEnum {
  NO = 2, // 不置顶
  YES = 1, // 置顶
}

// ==================== 评论 & 留言 (Comment & Message) ====================

/** 评论类型枚举 */
export enum CommentTypeEnum {
  ALL = null as any, // 全部
  ARTICLE = 1, // 文章
  FRIEND = 2, // 友链
  TALK = 3, // 说说
}

/** 评论状态枚举 */
export enum CommentStatusEnum {
  NORMAL = 0, // 正常
  EDITED = 1, // 已编辑
  DELETED = 2, // 已删除（软删除）
}

/** 评论审核状态枚举 */
export enum CommentReviewEnum {
  PENDING = 0, // 待审核
  APPROVED = 1, // 已通过
}

/** 留言状态枚举 */
export enum MessageStatusEnum {
  NORMAL = 0, // 正常
  EDITED = 1, // 已编辑
  DELETED = 2, // 已删除（软删除）
}

// ==================== 友链 (Friend) ====================

/** 友链状态枚举 */
export enum FriendStatusEnum {
  NORMAL = 0, // 正常
  DISABLED = 1, // 禁用
}

// ==================== 用户 & 登录 (User & Login) ====================

/** 用户状态枚举 */
export enum UserStatusEnum {
  NORMAL = 0, // 正常
  DISABLED = 1, // 禁用
}

/** 登录类型枚举 */
export enum LoginTypeEnum {
  USERNAME = "username", // 用户名
  EMAIL = "email", // 邮箱
  PHONE = "phone", // 手机
  OAUTH = "oauth", // 第三方登录
}

// ==================== 角色 (Role) ====================

/** 角色状态枚举 */
export enum RoleStatusEnum {
  NORMAL = 0, // 正常
  DISABLED = 1, // 禁用
}

/** 角色默认枚举 */
export enum RoleDefaultEnum {
  NO = 0, // 非默认
  YES = 1, // 默认
}

// ==================== 菜单 (Menu) ====================

/** 菜单类型枚举 */
export enum MenuTypeEnum {
  CATALOG = "CATALOG", // 目录
  MENU = "MENU", // 菜单
  BUTTON = "BUTTON", // 按钮
}

/** 菜单显示状态枚举 */
export enum MenuVisibleEnum {
  HIDDEN = 0, // 隐藏
  VISIBLE = 1, // 显示
}

/** 菜单状态枚举 */
export enum MenuStatusEnum {
  NORMAL = 0, // 正常
  DISABLED = 1, // 禁用
}

// ==================== 接口 (API) ====================

/** 接口状态枚举 */
export enum ApiStatusEnum {
  NORMAL = 0, // 正常
  DISABLED = 1, // 禁用
}

/** 接口日志记录枚举 */
export enum ApiTraceableEnum {
  NO = 0, // 不记录
  YES = 1, // 记录
}

// ==================== 通知 (Notification) ====================

/** 通知类型枚举 */
export enum NoticeTypeEnum {
  SYSTEM = "system", // 系统公告
  MAINTENANCE = "maintenance", // 维护通知
  UPDATE = "update", // 功能更新
  REMIND = "remind", // 重要提醒
}

/** 通知等级枚举 */
export enum NoticeLevelEnum {
  INFO = "info", // 普通
  WARNING = "warning", // 警告
  ERROR = "error", // 紧急
}

/** 通知发布状态枚举 */
export enum NoticePublishStatusEnum {
  DRAFT = 1, // 草稿
  PUBLISHED = 2, // 已发布
  REVOKED = 3, // 已撤回
}

/** 通知状态枚举（统一通知消息） */
export enum NotifyStatusEnum {
  DRAFT = "draft",
  PUBLISHED = "published",
  REVOKED = "revoked",
}

/** 通知目标类型枚举 */
export enum NotifyTargetTypeEnum {
  ALL = "all",
  USER_IDS = "user_ids",
}

// ==================== 通用 (Common) ====================

/** 通用开关枚举 */
export enum SwitchEnum {
  OFF = 0, // 关闭/禁用
  ON = 1, // 开启/启用
}
