import axiosClient from '@/api/axios-client'
import {
  ICategory,
  ICategoryQueryParams,
  ICreateCategoryBody,
  IUpdateCategoryBody
} from '@/types/category'
import { IListResponse, ISuccessResponse } from '@/types/response'

const categoryApi = {
  getAllCategories(params?: ICategoryQueryParams) {
    return axiosClient.get<undefined, ISuccessResponse<IListResponse<ICategory>>>('/categories', {
      params
    })
  },
  getCategoryById(categoryId: number) {
    return axiosClient.get<undefined, ISuccessResponse<ICategory>>(`/categories/${categoryId}`)
  },
  createCategory(body: ICreateCategoryBody) {
    return axiosClient.post<undefined, ISuccessResponse<ICategory>>('/categories', body)
  },
  updateCategory({ categoryId, body }: { categoryId: number; body: IUpdateCategoryBody }) {
    return axiosClient.patch<undefined, ISuccessResponse<ICategory>>(
      `/categories/${categoryId}`,
      body
    )
  },
  deleteCategory(categoryId: number) {
    return axiosClient.delete(`/categories/${categoryId}`)
  }
}

export default categoryApi
