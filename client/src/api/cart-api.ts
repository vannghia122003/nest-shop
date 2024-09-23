import axiosClient from '@/api/axios-client'
import { ICartItem } from '@/types/product'
import { ISuccessResponse } from '@/types/response'

const cartApi = {
  getCart() {
    return axiosClient.get<undefined, ISuccessResponse<ICartItem[]>>('/cart')
  },
  addToCart(body: { productId: number; quantity: number }) {
    return axiosClient.post<undefined, ISuccessResponse<undefined>>('/cart/add-to-cart', body)
  },
  updateCart(body: { productId: number; quantity: number }) {
    return axiosClient.put<undefined, ISuccessResponse<undefined>>('/cart/update', body)
  },
  deleteProduct(body: { productIds: number[] }) {
    return axiosClient.delete<undefined, ISuccessResponse<undefined>>('/cart/delete', {
      data: body
    })
  }
}

export default cartApi
