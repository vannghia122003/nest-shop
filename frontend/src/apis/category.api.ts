import {
  Category,
  CategoryListQuery,
  CategoryListResponse,
  CategoryBody
} from '~/types/category.type'
import http from './http'
import { SuccessResponse } from '~/types/response.type'

const categoryApi = {
  getCategories(params?: CategoryListQuery) {
    return http.get<undefined, CategoryListResponse>('/categories', { params })
  },
  getCategory(category_id: string) {
    return http.get<undefined, SuccessResponse<Category>>(`/categories/${category_id}`)
  },
  createCategory(data: CategoryBody) {
    return http.post<undefined, SuccessResponse<Category>>('/categories', data)
  },
  updateCategory({ category_id, data }: { category_id: string; data: CategoryBody }) {
    return http.put<undefined, SuccessResponse<Category>>(`/categories/${category_id}`, data)
  },
  deleteCategory(category_id: string) {
    return http.delete(`/categories/${category_id}`)
  }
}

export default categoryApi
