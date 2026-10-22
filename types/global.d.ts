/**
 * 全局类型声明
 */
declare global {
  /** API 响应包装类型 */
  interface IApiResponse<T = any> {
    code: string;
    data: T;
    message: string;
    trace_id: string;
  }

  /** API 响应结构（request.ts 响应拦截器使用） */
  type ApiResponse<T = any> = IApiResponse<T>;

  /** 分页数据结构 */
  interface PageResult<T = any> {
    list: T[];
    total: number;
  }

  /** 基础查询参数 */
  interface BaseQueryParams {
    /** 页码 */
    pageNum: number;
    /** 每页记录数 */
    pageSize: number;
    /** 排序字段 */
    sortBy?: string;
    /** 排序方式（正序:ASC；反序:DESC） */
    order?: string;
  }

  /** 下拉选项 */
  interface OptionItem {
    value: string | number;
    label: string;
    children?: OptionItem[];
  }
}

export {};
