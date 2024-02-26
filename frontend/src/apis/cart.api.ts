import { SuccessResponse } from '~/types/response.type'
import http from './http'
import { ProductLineItem } from '~/types/product.type'

const cartApi = {
  getCart() {
    return http.get<undefined, SuccessResponse<ProductLineItem[]>>('/cart')
  },
  addToCart(data: { product_id: string; buy_count: number }) {
    return http.post<undefined, SuccessResponse<undefined>>('/cart', data)
  },
  updateCart(data: { product_id: string; buy_count: number }) {
    return http.put<undefined, SuccessResponse<undefined>>(`/cart/${data.product_id}`, {
      buy_count: data.buy_count
    })
  },
  deleteProductsInCart(product_ids: string[]) {
    return http.delete<undefined, SuccessResponse<undefined>>('/cart', { data: { product_ids } })
  },
  buyProducts(product_ids: string[]) {
    return http.post<undefined, SuccessResponse<undefined>>('/cart/buy-products', { product_ids })
  }
}

export default cartApi
