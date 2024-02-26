import { SuccessResponse } from './response.type'

export interface ProductListQuery {
  page?: number | string
  limit?: number | string
  sort_by?: 'createdAt' | 'popular' | 'price' | 'sold'
  order?: 'asc' | 'desc'
  name?: string
  category_id?: string
  rating?: 1 | 2 | 3 | 4 | 5
  price_min?: number | string
  price_max?: number | string
}

export interface Product {
  _id: string
  name: string
  description: string
  quantity: number
  price: number
  image: string
  images: string[]
  view: number
  sold: number
  rating: number
  review: number
  category?: {
    _id: string
    name: string
    image: string
  }
  created_at: string
  updated_at: string
}

export interface ProductBody {
  name: string
  description: string
  quantity: number
  price: number
  sold: number
  view: number
  image: string
  images: string[]
  category_id: string
}

export interface ProductListResponse extends SuccessResponse<Product[]> {
  page: number
  total_pages: number
  total_results: number
}

export interface ProductLineItem {
  product_id: string
  buy_count: number
  product_detail: Product
}
