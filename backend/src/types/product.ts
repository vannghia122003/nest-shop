import { ObjectId } from 'mongodb'
import { PaginationReqQuery } from './common'

export interface ProductLineItem {
  product_id: ObjectId
  buy_count: number
}

export interface CreateProductReqBody {
  name: string
  description: string
  quantity: number
  price: number
  image: string
  images?: string[]
  category_id: string
  view?: number
  sold?: number
  review?: number
  rating?: number
}

export interface UpdateProductReqBody {
  name?: string
  description?: string
  quantity?: number
  price?: number
  image?: string
  images?: string[]
  view?: number
  sold?: number
  review?: number
  rating?: number
  category_id?: string
}

export interface UpdateProductType extends Omit<UpdateProductReqBody, 'category_id'> {
  category_id?: ObjectId
}

export interface GetProductsReqQuery extends PaginationReqQuery {
  sort_by?: 'createAt' | 'popular' | 'price' | 'sold'
  order?: 'asc' | 'desc'
  name?: string
  category_id?: string
  rating?: 1 | 2 | 3 | 4 | 5
  price_min?: string
  price_max?: string
}

export interface ProductIdReqParams {
  product_id: string
}

export interface ReviewIdReqParams {
  product_id: string
  review_id: string
}

export interface CreateReviewReqBody {
  comment: string
  rating: number
}

export interface UpdateReviewReqBody {
  comment: string
  rating: number
}
