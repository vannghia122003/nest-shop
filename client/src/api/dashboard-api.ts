import axiosClient from '@/api/axios-client'
import { ICategory } from '@/types/category'
import { ISuccessResponse } from '@/types/response'

const dashboardApi = {
  getStats() {
    return axiosClient.get<
      undefined,
      ISuccessResponse<{
        totalRevenue: number
        customerCount: number
        orderCount: number
        productCount: number
      }>
    >('/dashboard/stats')
  },
  getRevenue(year: number) {
    return axiosClient.get<undefined, ISuccessResponse<{ date: string; revenue: number }[]>>(
      '/dashboard/revenue',
      { params: { year } }
    )
  },
  getBestSellingCategories() {
    return axiosClient.get<undefined, ISuccessResponse<{ category: ICategory; sold: number }[]>>(
      '/dashboard/best-selling-categories'
    )
  }
}

export default dashboardApi
