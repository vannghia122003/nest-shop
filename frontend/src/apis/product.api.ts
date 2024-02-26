import { ProductListResponse, ProductListQuery, Product, ProductBody } from '~/types/product.type'
import http from './http'
import { SuccessResponse } from '~/types/response.type'
import { Review, ReviewBody, ReviewListQuery, ReviewListResponse } from '~/types/review.type'

const productApi = {
  getProducts(params: ProductListQuery) {
    return http.get<undefined, ProductListResponse>('/products', {
      params
    })
  },
  getProductDetail(product_id: string) {
    return http.get<undefined, SuccessResponse<Product>>(`/products/${product_id}`)
  },
  deleteProduct(product_id: string) {
    return http.delete(`/products/${product_id}`)
  },
  createProduct(data: ProductBody) {
    return http.post<undefined, SuccessResponse<Product>>('/products', data)
  },
  updateProduct({ product_id, data }: { product_id: string; data: ProductBody }) {
    return http.put<undefined, SuccessResponse<Product>>(`/products/${product_id}`, data)
  },

  createReview({ product_id, data }: { product_id: string; data: ReviewBody }) {
    return http.post<undefined, ReviewListResponse>(`/products/${product_id}/reviews`, data)
  },
  getReviews({ product_id, params }: { product_id: string; params?: ReviewListQuery }) {
    return http.get<undefined, ReviewListResponse>(`/products/${product_id}/reviews`, {
      params
    })
  },
  getReviewDetai({ product_id, review_id }: { product_id: string; review_id: string }) {
    return http.get<undefined, SuccessResponse<Review>>(
      `/products/${product_id}/reviews/${review_id}`
    )
  },
  deleteReview({ product_id, review_id }: { product_id: string; review_id: string }) {
    return http.delete(`/products/${product_id}/reviews/${review_id}`)
  },
  updateReview({
    product_id,
    review_id,
    data
  }: {
    product_id: string
    review_id: string
    data: ReviewBody
  }) {
    return http.put(`/products/${product_id}/reviews/${review_id}`, data)
  }
}

export default productApi
