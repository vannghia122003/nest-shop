import { SuccessResponse } from '~/types/response.type'
import http from './http'
import { Order, OrderListResponse, OrderStatus, OrderQuery } from '~/types/order.type'

const orderApi = {
  getUserOrders(params: OrderQuery) {
    return http.get<undefined, OrderListResponse>('/orders/user', {
      params
    })
  },
  getOrders(params: OrderQuery) {
    return http.get<undefined, OrderListResponse>('/orders', {
      params
    })
  },
  getOrderDetail(order_id: string) {
    return http.get<undefined, SuccessResponse<Order>>(`/orders/${order_id}`)
  },
  updateOrder({ order_id, data }: { order_id: string; data: { status: OrderStatus } }) {
    return http.put<undefined, SuccessResponse<Order>>(`/orders/${order_id}`, data)
  },
  deleteOrder(order_id: string) {
    return http.delete(`/orders/${order_id}`)
  }
}

export default orderApi
