import { SuccessResponse } from './response.type'

export interface Category {
  _id: string
  name: string
  image: string
  created_at: string
  updated_at: string
}

export interface CategoryListQuery {
  page?: number | string
  limit?: number | string
}

export interface CategoryListResponse extends SuccessResponse<Category[]> {
  page: number
  total_pages: number
  total_results: number
}

export interface CategoryBody {
  name: string
  image: string
}
