import { IProduct } from '@/types/product'
import { IUser } from '@/types/user'

export enum OrderStatus {
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface IOrder {
  id: number
  status: OrderStatus
  province: string
  district: string
  ward: string
  address: string
  updatedAt: string
  createdAt: string
  user: IUser
  ordersItem: { id: number; quantity: number; unitPrice: number; product: IProduct }[]
}

export interface ICreateOrderBody {
  province: string
  district: string
  ward: string
  address: string
}

export interface IUpdateOrderBody {
  status: OrderStatus
}

export interface IOrderQueryParams {
  page?: string
  limit?: string
  sortBy?: 'id:ASC' | 'id:DESC' | 'createdAt:ASC' | 'createdAt:DESC'
  search?: string
  searchBy?: 'status'
}
