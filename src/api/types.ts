export interface AboutMeVO {
  content: string;
}

export interface AlbumVO {
  id?: number;
  album_name: string;
  album_desc: string;
  album_cover: string;
  is_delete: number;
  status: number;
  created_at: number;
  updated_at: number;
  photo_count: number;
}

export interface ApiVO {
  id?: number; // 主键id
  parent_id: number; // 分组id
  name: string; // api名称
  path: string; // api路径
  method: string; // api请求方法
  traceable: number; // 是否追溯操作记录 0不需要，1需要
  status: number; // 状态 0正常 1禁用
  created_at: number; // 创建时间
  updated_at: number; // 更新时间
  children?: ApiVO[];
}

export interface ArticleStatisticsVO {
  date: string;
  count: number;
}

export interface ArticleVO {
  id?: number;
  article_cover: string;
  article_title: string;
  article_content: string;
  article_type: number;
  original_url: string;
  is_top: number;
  is_delete: number;
  status: number;
  created_at: number;
  updated_at: number;
  category_name: string;
  tag_name_list: string[];
  like_count: number;
  view_count: number;
}

export interface ArticleViewVO {
  id?: number;
  article_title: string;
  view_count: number;
}

export interface BatchMarkRecordsReadReq {
  ids: number[];
}

export interface BatchResp {
  success_count: number;
}

export interface BindMeEmailReq {
  email: string; // 邮箱
  verify_code: string; // 验证码
}

export interface BindMeMobileReq {
  mobile: string; // 手机号
  verify_code: string; // 验证码
}

export interface BindMeThirdPartyReq {
  platform: string; // 平台
  code: string; // 授权码
  state?: string; // 状态
}

export interface CategoryOverviewVO {
  id?: number;
  category_name: string;
  article_count: number;
}

export interface CategoryVO {
  id?: number;
  category_name: string;
  article_count: number;
  created_at: number;
  updated_at: number;
}

export interface CleanApiResp {
  success_count: number; // 清空成功数量
}

export interface CleanMenuReq {
}

export interface CleanMenuResp {
  success_count: number; // 清空成功数量
}

export interface CommentVO {
  id: number;
  user_id: string;
  device_id: string;
  type: number;
  topic_title: string;
  reply_user_id: string;
  comment_content: string;
  status: number;
  created_at: number;
  guest_info: GuestInfoVO;
  user_info: UserInfoVO;
  reply_user_info: UserInfoVO;
}

export interface CreateAlbumReq {
  album_name: string;
  album_desc: string;
  album_cover: string;
  status: number;
}

export interface CreateApiReq {
  parent_id: number; // 分组id
  name: string; // api名称
  path: string; // api路径
  method: string; // api请求方法
  traceable: number; // 是否追溯操作记录 0不需要，1需要
  status: number; // 状态 0正常 1禁用
}

export interface CreateArticleReq {
  article_cover: string;
  article_title: string;
  article_content: string;
  article_type: number;
  original_url: string;
  is_top: number;
  status: number;
  category_name?: string;
  tag_name_list?: string[];
}

export interface CreateCategoryReq {
  category_name: string;
}

export interface CreateFriendReq {
  link_name: string;
  link_avatar: string;
  link_address: string;
  link_intro: string;
}

export interface CreateMenuReq extends MenuMeta {
  parent_id: number; // 父id
  path: string; // 路由地址
  name: string; // 路由名字
  component: string; // Layout组件
  redirect?: string; // 路由重定向
  children?: CreateMenuReq[];
}

export interface CreateNotifyMessageReq {
  title: string;
  content: string;
  category: string;
  level: string;
  target_type: string;
  target_ids?: string;
}

export interface CreateNotifyTemplateReq {
  code: string;
  channel: string;
  scene: string;
  title: string;
  content: string;
  enabled?: number;
}

export interface CreatePageReq {
  page_name: string;
  page_label: string;
  page_cover: string;
  is_carousel?: number;
  carousel_covers?: string[];
}

export interface CreatePhotoReq {
  album_id: number;
  photo_name: string;
  photo_desc: string;
  photo_src: string;
}

// 角色创建请求
export interface CreateRoleReq {
  parent_id?: number; // 父角色ID（可选，默认顶级角色）
  role_key: string; // 角色标识（必填，唯一）
  role_label: string; // 角色名称（必填）
  role_comment: string; // 角色备注（必填）
  is_default: number; // 是否默认角色 0-否 1-是（必填）
  status: number; // 状态 0-正常 1-禁用（必填）
}

export interface CreateTagReq {
  tag_name: string;
}

export interface CreateTalkReq {
  content: string;
  img_list: string[];
  is_top: number;
  status: number;
}

// 获取上传凭证请求
export interface CreateUploadTokenReq {
  file_name: string; // 文件名称
  file_base?: string; // 文件目录
  expire_seconds?: number; // 凭证有效期（秒），默认1小时
}

// 获取上传凭证响应（完整的UploadToken结构）
export interface CreateUploadTokenResp {
  upload_url: string; // 上传地址
  token: string; // 上传凭证/Token
  policy: string; // 上传策略
  signature: string; // 签名
  file_key: string; // 文件Key/路径
  access_url: string; // 上传成功后的访问URL
  expire_at: number; // 凭证过期时间戳（秒）
  extra_data: Record<string, any>; // 额外数据
}

export interface DashboardStats {
  date: string;
  new_users: number;
  total_users: number;
  active_users: number;
  uv_count: number;
  pv_count: number;
  total_uv_count: number;
  total_pv_count: number;
}

export interface DeleteAlbumReq {
  ids: number[];
}

export interface DeleteApiReq {
  ids: number[]; // 主键id
}

export interface DeleteArticleReq {
  id: number;
}

export interface DeleteCategoryReq {
  ids: number[];
}

export interface DeleteCommentReq {
  ids: number[];
}

export interface DeleteFriendReq {
  ids: number[];
}

export interface DeleteLoginLogReq {
  ids: number[];
}

export interface DeleteMenuReq {
  ids: number[]; // 主键id
}

export interface DeleteMessageReq {
  ids: number[];
}

export interface DeleteNotifyMessageReq {
  ids: number[];
}

export interface DeleteNotifyRecordReq {
  ids: number[];
}

export interface DeleteNotifyTemplateReq {
  ids: number[];
}

export interface DeleteOperationLogReq {
  ids: number[];
}

export interface DeletePageReq {
  ids: number[];
}

export interface DeletePhotoReq {
  ids: number[];
}

// 删除角色请求
export interface DeleteRoleReq {
  ids: number[]; // 角色ID列表
}

export interface DeleteTagReq {
  ids: number[];
}

export interface DeleteTalkReq {
  ids: number[];
}

export interface DeleteUploadLogReq {
  ids: number[];
}

export interface DeleteVisitLogReq {
  ids: number[];
}

export interface DestroyAlbumReq {
  ids: number[];
}

export interface DestroyPhotoReq {
  ids: number[];
}

// 邮箱验证码登录（仅登录，未注册报错）
export interface EmailLoginReq {
  email: string; // 邮箱
  code: string; // 验证码
}

export interface EmptyReq {
}

export interface EmptyResp {
}

export interface ExportArticleReq {
  ids: number[];
}

export interface FileInfoVO {
  file_base: string; // 文件目录
  file_name: string; // 文件名称
  file_type: string; // 文件类型
  file_size: number; // 文件大小
  file_url: string; // 上传路径
  updated_at: number; // 更新时间
}

export interface FriendVO {
  id?: number;
  link_name: string;
  link_avatar: string;
  link_address: string;
  link_intro: string;
  created_at: number;
  updated_at: number;
}

export interface GetAlbumReq {
  id: number;
}

export interface GetApiReq {
  id: number; // 主键id
}

export interface GetArticleReq {
  id: number;
}

export interface GetArticleStatsResp {
  category_list: CategoryOverviewVO[];
  tag_list: TagOverviewVO[];
  article_view_ranks: ArticleViewVO[];
  article_statistics: ArticleStatisticsVO[];
}

export interface GetCaptchaReq {
  width?: number; // 宽度
  height?: number; // 高度
}

export interface GetCaptchaResp {
  captcha_key: string; // 验证码key
  captcha_base64: string; // 验证码base64
}

export interface GetGeoStatsReq {
  start_date: string;
  end_date?: string;
}

export interface GetGeoStatsResp {
  users: RegionStatVO[];
  visitors: RegionStatVO[];
}

export interface GetGuestReq {
}

export interface GetGuestResp {
  id: number; // 访客唯一ID
  device_id: string; // 设备ID
  os: string; // 操作系统
  browser: string; // 浏览器
  ip_address: string; // IP地址
  ip_source: string; // IP归属地
}

export interface GetMeApisResp {
  list: UserApi[];
}

export interface GetMeMenusResp {
  list: UserMenu[];
}

export interface GetMeReq {
}

export interface GetMeRolesResp {
  list: UserRole[];
}

export interface GetMenuReq {
  id: number; // 主键
}

export interface GetNotifyMessageReq {
  id: number;
}

export interface GetNotifyTemplateReq {
  id: number;
}

// 第三方登录授权URL
export interface GetOauthAuthorizeUrlReq {
  platform: string; // 平台
  state?: string; // 状态
}

export interface GetOauthAuthorizeUrlResp {
  authorize_url: string; // 授权地址
}

// 获取角色权限请求
export interface GetRolePermissionsReq {
  role_id: number; // 角色ID
}

// 获取角色详情请求
export interface GetRoleReq {
  id: number; // 角色ID
}

export interface GetStatsDashboardResp {
  user_count: number;
  article_count: number;
  message_count: number;
  today: DashboardStats;
  uv_growth_rate: number;
  pv_growth_rate: number;
  user_growth_rate: number;
}

export interface GetTalkReq {
  id: number;
}

// 获取用户详情请求
export interface GetUserDetailReq {
  user_id: string; // 用户ID (UUID)
}

// 用户详情响应
export interface GetUserDetailResp extends UserVO {
  last_login: UserLastLogin;
}

export interface GetVisitTrendReq {
  start_date: string;
  end_date?: string;
}

export interface GetVisitTrendResp {
  list: DashboardStats[];
}

export interface GuestInfoVO {
  device_id: string; // 设备ID
  os: string; // 操作系统
  browser: string; // 浏览器
  ip_address: string; // IP地址
  ip_source: string; // IP归属地
}

export interface GuestItem {
  id?: number;
  device_id: string; // 设备ID
  os: string; // 操作系统
  browser: string; // 浏览器
  ip_address: string; // IP地址
  ip_source: string; // IP归属地
  created_at: number; // 创建时间
  updated_at: number; // 更新时间
}

export interface IdReq {
  id: number;
}

export interface IdsReq {
  ids: number[];
}

export interface ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
}

export interface ListResult {
  page: number;
  page_size: number;
  total: number;
  list: any;
}

export interface LoginLogVO {
  id?: number;
  user_id: string; // 用户id
  device_id: string; // 终端id
  login_type: string; // 登录类型
  status: number; // 登录状态：0-失败 1-成功
  fail_reason: string; // 失败原因
  login_at: number; // 登录时间（对应 proto 的 created_at）
  logout_at: number; // 登出时间
  user_info: UserInfoVO; // 用户信息
  guest_info: GuestInfoVO; // 游客信息
}

// 登录响应
export interface LoginResp {
  user_id: string; // 用户id
  user_type: string; // 用户类型：user-普通用户 admin-管理员
  scope: string; // 作用域
  token: Token;
}

export interface LogoutReq {
}

export interface LogoutResp {
}

export interface MarkAllRecordsReadReq {
  user_id: string;
}

export interface MarkRecordReadReq {
  id: number;
}

export interface MenuMeta {
  type: string; // 菜单类型（CATALOG目录、MENU菜单、BUTTON按钮）
  title?: string; // 菜单标题
  icon?: string; // 菜单图标
  rank?: number; // 排序
  perm?: string; // 权限标识
  params?: MenuMetaParams[]; // 参数
  keep_alive?: number; // 是否缓存
  always_show?: number; // 是否一直显示菜单
  visible?: number; // 菜单是否可见
  status: number; // 状态 0正常 1禁用
}

export interface MenuMetaParams {
  key: string;
  value: string;
}

export interface MenuVO extends MenuMeta {
  id?: number; // 主键
  parent_id: number; // 父id
  path: string; // 路由地址
  name: string; // 路由名字
  component: string; // Layout组件
  redirect?: string; // 路由重定向
  type: string; // 菜单类型（CATALOG目录、MENU菜单、BUTTON按钮）
  title?: string; // 菜单标题
  icon?: string; // 菜单图标
  rank?: number; // 排序
  perm?: string; // 权限标识
  params?: MenuMetaParams[]; // 参数
  keep_alive?: number; // 是否缓存
  always_show?: number; // 是否一直显示菜单
  visible?: number; // 菜单是否可见
  status: number; // 状态 0正常 1禁用
  created_at: number; // 创建时间
  updated_at: number; // 更新时间
  children?: MenuVO[];
}

export interface MessageVO {
  id?: number;
  user_id: string;
  device_id: string;
  message_content: string;
  status: number;
  created_at: number;
  updated_at: number;
  user_info: UserInfoVO;
  guest_info: GuestInfoVO;
}

// 手机验证码登录（自动注册）
export interface MobileLoginReq {
  mobile: string; // 手机号
  code: string; // 验证码
}

export interface NotifyMessageVO {
  id?: number;
  title: string;
  content: string;
  category: string;
  level: string;
  target_type: string;
  target_ids: string;
  status: string;
  published_at: number;
  published_by: string;
  created_at: number;
  updated_at: number;
}

export interface NotifyRecordVO {
  id?: number;
  message_id: number;
  channel: string;
  recipient: string;
  template_code: string;
  content: string;
  status: string;
  biz_id: string;
  error_msg: string;
  read_at: number;
  sent_at: number;
  created_at: number;
  title: string;
  category: string;
  level: string;
}

export interface NotifyTemplateVO {
  id?: number;
  code: string;
  channel: string;
  scene: string;
  title: string;
  content: string;
  enabled: number;
  created_at: number;
  updated_at: number;
}

// 第三方登录（前端携带code）
export interface OauthLoginReq {
  platform: string; // 平台
  code: string; // 授权码
  state?: string; // 状态
}

export interface OnlineUserItem {
  user_info: UserInfoVO;
  guest_info: GuestInfoVO;
  last_active_at: number;
}

export interface OnlineUserListResp {
  list: OnlineUserItem[];
}

export interface OperationLogVO {
  id?: number;
  user_id: string;
  device_id: string;
  module: string;
  description: string;
  request_uri: string;
  request_method: string;
  request_data: string;
  response_data: string;
  response_status: number;
  cost: string;
  created_at: number;
  updated_at: number;
  user_info: UserInfoVO;
  guest_info: GuestInfoVO;
}

export interface PageVO {
  id?: number;
  page_name: string;
  page_label: string;
  page_cover: string;
  is_carousel: number;
  carousel_covers: string[];
  created_at: number;
  updated_at: number;
}

// 密码登录（账号/手机号/邮箱 + 密码）
export interface PasswordLoginReq {
  account: string; // 账号/手机号/邮箱
  password: string; // 密码
  captcha_key?: string; // 图形验证码key
  captcha_code?: string; // 图形验证码
}

export interface PatchArticleReq {
  id: number;
  is_delete?: number;
  is_top?: number;
}

export interface PatchCommentsReq {
  ids: number[];
  status: number;
}

export interface PatchMessagesReq {
  ids: number[];
  status: number;
}

export interface PhotoVO {
  id?: number;
  album_id: number;
  photo_name: string;
  photo_desc: string;
  photo_src: string;
  is_delete: number;
  created_at: number;
  updated_at: number;
}

export interface PingReq {
}

export interface PingResp {
  env: string;
  name: string;
  version: string;
  runtime: string;
  description: string;
}

export interface PublishNotifyMessageReq {
  id: number;
}

export interface QueryAlbumListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  album_name?: string;
  is_delete?: number;
}

export interface QueryApiListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  name?: string; // api名称
  path?: string; // api路径
  method?: string; // api请求方法
  status?: number; // 状态
}

export interface QueryArticleListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  article_title?: string;
  article_type?: number;
  is_top?: number;
  is_delete?: number;
  status?: number;
  category_name?: string;
  tag_name?: string;
}

export interface QueryCategoryListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  category_name?: string;
}

export interface QueryCommentListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  user_id?: string;
  status?: number;
  type?: number;
}

// 查询上传列表请求
export interface QueryFileListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  file_base?: string; // 文件目录（筛选）
  keyword?: string; // 文件名关键词
}

// 查询上传列表响应
export interface QueryFileListResp {
  list: FileInfoVO[]; // 文件列表
  total: number; // 总数
  page: number; // 当前页码
  page_size: number; // 每页条数
}

export interface QueryFriendListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  link_name?: string;
}

export interface QueryGuestListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  device_id?: string; // 设备ID
  ip_source?: string; // IP归属地
}

export interface QueryLoginLogListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  user_id?: string;
  status?: number; // 登录状态：0-失败 1-成功
  start_date?: string;
  end_date?: string;
}

export interface QueryMeLoginLogListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
}

export interface QueryMenuListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  name?: string; // 路由名字
  title?: string; // 菜单标题
  status?: number; // 状态
}

export interface QueryMessageListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  user_id?: string;
  status?: number;
}

export interface QueryNotifyMessageListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  category?: string;
  level?: string;
  status?: string;
  target_type?: string;
}

export interface QueryNotifyRecordListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  channel?: string;
  status?: string;
  recipient?: string;
}

export interface QueryNotifyTemplateListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  channel?: string;
}

export interface QueryOperationLogListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  user_id?: string;
  module?: string;
  start_date?: string;
  end_date?: string;
}

export interface QueryPageListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  page_name?: string;
}

export interface QueryPhotoListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  album_id?: number;
  is_delete?: number;
}

// 角色列表查询请求
export interface QueryRoleListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  role_key?: string; // 角色标识（模糊查询）
  role_label?: string; // 角色名称（模糊查询）
  status?: number; // 状态 0-正常 1-禁用（精确查询）
}

export interface QueryTagListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  tag_name?: string;
}

export interface QueryTalkListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  status?: number;
}

export interface QueryUploadLogListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  file_type?: string;
}

export interface QueryUserInboxRecordListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  user_id: string;
  only_unread?: number;
  title?: string;
}

export interface QueryUserInboxRecordListResp {
  page: number;
  page_size: number;
  total: number;
  unread_total: number;
  list: any;
}

// 用户列表查询请求
export interface QueryUserListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  mobile?: string; // 手机号筛选
  status?: number; // 状态筛选
  keyword?: string; // 关键词搜索（昵称/手机号）
}

export interface QueryVisitLogListReq extends ListQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
  user_id?: string;
  device_id?: string;
  page_name?: string;
}

export interface RefreshTokenReq {
  user_id: string; // 用户id
  grant_type: string; // 授权类型
  refresh_token: string; // 刷新令牌
}

export interface RegionStatVO {
  region: string;
  count: number;
}

// 邮箱注册（必须设密码）
export interface RegisterReq {
  email: string; // 邮箱
  password: string; // 密码
  code: string; // 验证码
  username?: string; // 用户名
  nickname?: string; // 昵称
}

export interface RegisterResp {
}

// 重置密码请求（免登录，通过验证码）
export interface ResetPasswordReq {
  email: string; // 邮箱
  password: string; // 新密码
  confirm_password: string; // 确认密码
  code: string; // 验证码
}

export interface ResetPasswordResp {
}

// 重置用户密码请求
export interface ResetUserPasswordReq {
  user_id: string; // 用户ID (UUID)
  new_password: string; // 新密码
}

// 重置用户密码响应
export interface ResetUserPasswordResp {
}

export interface RestoreAlbumReq {
  ids: number[];
}

export interface RestorePhotoReq {
  ids: number[];
}

export interface RevokeNotifyMessageReq {
  id: number;
}

export interface RewardQrCode {
  alipay_qr_code: string;
  weixin_qr_code: string;
}

// 角色资源权限响应
export interface RolePermissionsResp {
  role_id: number; // 角色ID
  api_ids: number[]; // 绑定的接口权限ID列表
  menu_ids: number[]; // 绑定的菜单权限ID列表
}

// 角色信息VO - 后端返回视图对象
export interface RoleVO {
  id?: number; // 主键ID
  parent_id: number; // 父角色ID
  role_key: string; // 角色标识（唯一）
  role_label: string; // 角色名称（展示用）
  role_comment: string; // 角色备注说明
  is_default: number; // 是否默认角色 0-否 1-是
  status: number; // 状态 0-正常 1-禁用
  created_at: number; // 创建时间（时间戳）
  updated_at: number; // 更新时间（时间戳）
}

// 发送邮箱验证码
export interface SendEmailCodeReq {
  email: string; // 邮箱
  type: string; // login / register / reset_password / bind_email
}

export interface SendEmailCodeResp {
}

// 发送手机验证码
export interface SendMobileCodeReq {
  mobile: string; // 手机号
  type: string; // login / reset_password / bind_phone
}

export interface SendMobileCodeResp {
}

export interface Server {
  os: any;
  cpu: any;
  ram: any;
  disk: any;
}

export interface SocialAccountInfo {
  name: string;
  platform: string;
  link_url: string;
  enabled: boolean;
}

export interface SyncApiResp {
  success_count: number; // 同步成功数量
}

export interface SyncMenuReq {
  menus: CreateMenuReq[];
}

export interface SyncMenuResp {
  success_count: number; // 同步成功数量
}

export interface TagOverviewVO {
  id?: number;
  tag_name: string;
  article_count: number;
}

export interface TagVO {
  id?: number;
  tag_name: string;
  article_count: number;
  created_at: number;
  updated_at: number;
}

export interface TalkVO {
  id?: number;
  user_id: string;
  content: string;
  img_list: string[];
  is_top: number;
  status: number;
  like_count: number;
  comment_count: number;
  created_at: number;
  updated_at: number;
  user_info: UserInfoVO;
}

export interface ThirdPlatformInfo {
  name: string;
  platform: string;
  enabled: boolean;
}

export interface Token {
  token_type: string; // Token 类型（如 "Bearer"）
  access_token: string; // 访问令牌：用于接口访问，有效期短
  expires_in: number; // AccessToken 有效期（秒），如 3600（1小时）
  refresh_token: string; // 刷新令牌：仅用于刷新 AccessToken，有效期长
  refresh_expires_in: number; // RefreshToken 有效期（秒），如 604800（7天）
  refresh_expires_at: number; // RefreshToken 过期时间戳（秒）
}

export interface UnbindMeThirdPartyReq {
  platform: string; // 平台
}

export interface UpdateAlbumReq {
  id: number;
  album_name: string;
  album_desc: string;
  album_cover: string;
  status: number;
}

export interface UpdateApiReq {
  id: number; // 主键id
  parent_id: number; // 分组id
  name: string; // api名称
  path: string; // api路径
  method: string; // api请求方法
  traceable: number; // 是否追溯操作记录 0不需要，1需要
  status: number; // 状态 0正常 1禁用
}

export interface UpdateArticleReq {
  id: number;
  article_cover: string;
  article_title: string;
  article_content: string;
  article_type: number;
  original_url: string;
  is_top: number;
  status: number;
  category_name?: string;
  tag_name_list?: string[];
}

export interface UpdateCategoryReq {
  id: number;
  category_name: string;
}

export interface UpdateFriendReq {
  id: number;
  link_name: string;
  link_avatar: string;
  link_address: string;
  link_intro: string;
}

export interface UpdateMeAvatarReq {
  avatar: string; // 头像
}

export interface UpdateMePasswordReq {
  old_password: string; // 旧密码
  new_password: string; // 新密码
  confirm_password: string; // 确认密码
}

export interface UpdateMeReq extends UserInfoExt {
  nickname: string;
  avatar: string; // 用户头像
}

export interface UpdateMenuReq extends MenuMeta {
  id: number; // 主键
  parent_id: number; // 父id
  path: string; // 路由地址
  name: string; // 路由名字
  component: string; // Layout组件
  redirect?: string; // 路由重定向
  type: string; // 菜单类型（CATALOG目录、MENU菜单、BUTTON按钮）
  title?: string; // 菜单标题
  icon?: string; // 菜单图标
  rank?: number; // 排序
  perm?: string; // 权限标识
  params?: MenuMetaParams[]; // 参数
  keep_alive?: number; // 是否缓存
  always_show?: number; // 是否一直显示菜单
  visible?: number; // 菜单是否可见
  status: number; // 状态 0正常 1禁用
}

export interface UpdateNotifyMessageReq {
  id: number;
  title: string;
  content: string;
  category: string;
  level: string;
  target_type: string;
  target_ids?: string;
}

export interface UpdateNotifyTemplateReq {
  id: number;
  code: string;
  channel: string;
  scene: string;
  title: string;
  content: string;
  enabled: number;
}

export interface UpdatePageReq {
  id: number;
  page_name: string;
  page_label: string;
  page_cover: string;
  is_carousel?: number;
  carousel_covers?: string[];
}

export interface UpdatePhotoReq {
  id: number;
  album_id: number;
  photo_name: string;
  photo_desc: string;
  photo_src: string;
}

// 更新角色接口权限请求
export interface UpdateRoleApiPermissionsReq {
  role_id: number; // 角色ID（必填）
  api_ids: number[]; // 接口权限ID列表（必填，空数组表示清空权限）
}

// 更新角色菜单权限请求
export interface UpdateRoleMenuPermissionsReq {
  role_id: number; // 角色ID（必填）
  menu_ids: number[]; // 菜单权限ID列表（必填，空数组表示清空权限）
}

// 角色更新请求
export interface UpdateRoleReq {
  id: number; // 主键ID（必填）
  parent_id?: number; // 父角色ID（可选）
  role_key: string; // 角色标识（必填，唯一）
  role_label: string; // 角色名称（必填）
  role_comment: string; // 角色备注（必填）
  is_default: number; // 是否默认角色 0-否 1-是（必填）
  status: number; // 状态 0-正常 1-禁用（必填）
}

export interface UpdateTagReq {
  id: number;
  tag_name: string;
}

export interface UpdateTalkReq {
  id: number;
  content: string;
  img_list: string[];
  is_top: number;
  status: number;
}

// 更新用户角色请求
export interface UpdateUserRolesReq {
  user_id: string; // 用户ID (UUID)
  role_ids: number[]; // 角色ID列表
}

// 更新用户角色响应
export interface UpdateUserRolesResp {
}

// 更新用户状态请求
export interface UpdateUserStatusReq {
  user_id: string; // 用户ID (UUID)
  status: number; // 状态：0-禁用 1-正常 2-冻结
}

// 更新用户状态响应
export interface UpdateUserStatusResp {
}

export interface UploadFileReq {
  file?: any; // 文件
  file_base?: string; // 文件目录
}

export interface UploadFileResp {
  file_info: FileInfoVO; // 文件信息
}

export interface UploadLogVO {
  id?: number;
  user_id: string;
  device_id: string;
  file_base: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  created_at: number;
  updated_at: number;
  user_info: UserInfoVO;
  guest_info: GuestInfoVO;
}

export interface UserApi {
  id?: number; // 主键id
  parent_id: number; // 父id
  name: string; // api名称
  path: string; // api路径
  method: string; // api请求方法
  created_at: number; // 创建时间
  updated_at: number; // 更新时间
  children: UserApi[];
}

export interface UserInfoExt {
  gender?: number; // 性别 0未知 1男 2女
  intro?: string; // 简介
  website?: string; // 网站
}

export interface UserInfoVO {
  user_id: string;
  username: string;
  avatar: string;
  nickname: string;
  user_type: string;
}

export interface UserLastLogin {
  login_at: number; // 最后登录时间（毫秒时间戳）
  login_ip_address: string; // 最后登录IP地址
  login_ip_source: string; // 最后登录IP归属地
}

export interface UserMenu {
  id?: number; // 主键
  parent_id: number; // 父id
  path: string; // 路由地址
  name: string; // 路由名字
  component: string; // Layout组件
  redirect: string; // 路由重定向
  meta: UserMenuMeta; // meta配置
  children?: UserMenu[];
  created_at: number; // 创建时间
  updated_at: number; // 更新时间
}

export interface UserMenuMeta {
  title?: string;
  icon?: string;
  hidden?: boolean;
  alwaysShow?: boolean;
  affix?: boolean;
  keepAlive?: boolean;
  breadcrumb?: boolean;
}

export interface UserProfile extends UserInfoExt {
  user_id: string; // 用户ID（UUID）
  username: string; // 用户名
  nickname: string; // 真实姓名
  avatar: string; // 头像
  email: string; // 邮箱
  mobile: string; // 手机号
  status: number; // 状态：0-禁用 1-正常 2-冻结
  created_at: number; // 创建时间（毫秒时间戳）
  updated_at: number; // 更新时间（毫秒时间戳）
  third_party: UserThirdPartyInfo[]; // 第三方绑定
  roles: string[];
  perms: string[];
  gender?: number; // 性别 0未知 1男 2女
  intro?: string; // 简介
  website?: string; // 网站
}

export interface UserRole {
  id?: number; // 主键id
  parent_id: number; // 父id
  role_key: string; // 角色名
  role_label: string; // 角色标签
  role_comment: string; // 角色备注
}

export interface UserRoleLabel {
  role_id: number;
  role_key: string;
  role_label: string;
}

export interface UserThirdPartyInfo {
  platform: string; // 平台
  open_id: string; // 平台用户id
  nickname: string; // 昵称
  avatar: string; // 头像
  created_at: number; // 创建时间
}

// 用户信息项
export interface UserVO {
  id: number; // 用户ID
  user_id: string; // 用户ID (UUID)
  username: string; // 用户名
  nickname: string; // 用户昵称
  avatar: string; // 用户头像
  mobile?: string; // 用户手机号
  email?: string; // 用户邮箱
  status: number; // 状态：0-禁用 1-正常 2-冻结
  register_type: string; // 注册方式
  ip_address: string; // IP地址
  ip_source: string; // IP归属地
  created_at: number;
  updated_at: number;
  roles: UserRoleLabel[];
}

export interface VisitLogVO {
  id?: number;
  user_id: string;
  device_id: string;
  page_name: string;
  created_at: number;
  updated_at: number;
  user_info: UserInfoVO;
  guest_info: GuestInfoVO;
}

export interface WebsiteConfigVO {
  admin_url: string;
  websocket_url: string;
  tourist_avatar: string;
  user_avatar: string;
  website_feature: WebsiteFeature;
  website_info: WebsiteInfo;
  reward_qr_code: RewardQrCode;
  social_login_list: ThirdPlatformInfo[];
  social_url_list: SocialAccountInfo[];
}

export interface WebsiteFeature {
  is_chat_room: number;
  is_ai_assistant: number;
  is_music_player: number;
  is_comment_review: number;
  is_email_notice: number;
  is_message_review: number;
  is_reward: number;
}

export interface WebsiteInfo {
  website_author: string;
  website_avatar: string;
  website_create_time: string;
  website_intro: string;
  website_name: string;
  website_notice: string;
  website_record_no: string;
}
