import { SuccessResponse } from './response.type'

export interface ReviewListQuery {
  page?: number
  limit?: number
}

export interface Review {
  _id: string
  product_id: string
  comment: string
  rating: number
  review_date: string
  user: {
    _id: string
    name: string
    avatar: string
  }
}

export interface ReviewBody {
  rating: number
  comment: string
}

export interface ReviewListResponse extends SuccessResponse<Review[]> {
  page: number
  total_pages: number
  total_results: number
}
