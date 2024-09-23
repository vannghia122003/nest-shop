export interface ISuccessResponse<T> {
  statusCode: number
  message: string
  data: T
}

export interface IErrorResponse {
  statusCode: number
  message: string
  error: string
}

export interface IEntityErrorResponse {
  statusCode: number
  message: { field: string; message: string }[]
  error: string
}

export interface IListResponse<T> {
  data: T[]
  meta: {
    itemsPerPage: number
    totalItems: number
    currentPage: number
    totalPages: number
    search: string
    select: string[]
    filter?: {
      [column: string]: string | string[]
    }
  }
  links: {
    first?: string
    previous?: string
    current: string
    next?: string
    last?: string
  }
}
