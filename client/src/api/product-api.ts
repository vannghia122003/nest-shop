import axiosClient from '@/api/axios-client'
import {
  ICreateProductBody,
  ICreateReviewBody,
  IProduct,
  IProductDetail,
  IProductQueryParams,
  IReview,
  IReviewQueryParams,
  IUpdateProductBody
} from '@/types/product'
import { IListResponse, ISuccessResponse } from '@/types/response'

const productApi = {
  getAllProducts(params?: IProductQueryParams) {
    return axiosClient.get<undefined, ISuccessResponse<IListResponse<IProduct>>>('/products', {
      params
    })
  },
  getProductById(productId: number) {
    return axiosClient.get<undefined, ISuccessResponse<IProductDetail>>(`/products/${productId}`)
  },
  createProduct(body: ICreateProductBody) {
    return axiosClient.post<undefined, ISuccessResponse<IProduct>>('/products', body)
  },
  updateProduct({ productId, body }: { productId: number; body: IUpdateProductBody }) {
    return axiosClient.patch<undefined, ISuccessResponse<IProduct>>(`/products/${productId}`, body)
  },
  deleteProduct(productId: number) {
    return axiosClient.delete(`/products/${productId}`)
  },

  getAllReviews({ productId, params }: { productId: number; params?: IReviewQueryParams }) {
    return axiosClient.get<undefined, ISuccessResponse<IListResponse<IReview>>>(
      `/products/${productId}/reviews`,
      { params }
    )
  },
  getReviewById({ productId, reviewId }: { productId: number; reviewId: number }) {
    return axiosClient.get<undefined, ISuccessResponse<IReview>>(
      `/products/${productId}/reviews/${reviewId}`
    )
  },
  createReview({ productId, body }: { productId: number; body: ICreateReviewBody }) {
    return axiosClient.post<undefined, ISuccessResponse<IReview>>(
      `/products/${productId}/reviews`,
      body
    )
  },
  deleteReview({ productId, reviewId }: { productId: number; reviewId: number }) {
    return axiosClient.delete(`/products/${productId}/reviews/${reviewId}`)
  }
}

export default productApi
