import { ProductLineItem } from './product.type'
import { SuccessResponse } from './response.type'
import { User } from './user.type'

export type OrderStatus = 0 | 1 | 2 | 3 | -1

export interface Order {
  _id: string
  user: User
  total_price: number
  order_date: string
  status: OrderStatus
  products: ProductLineItem[]
}

export interface OrderQuery {
  status?: OrderStatus
  limit?: number | string
  page?: number | string
}

export interface OrderListResponse extends SuccessResponse<Order[]> {
  page: number
  total_pages: number
  total_results: number
}
