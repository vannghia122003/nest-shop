import axiosClient from '@/api/axios-client'
import { ICreateOrderBody, IOrder, IOrderQueryParams, IUpdateOrderBody } from '@/types/order'
import { IListResponse, ISuccessResponse } from '@/types/response'

const orderApi = {
  getAllOrders(params: IOrderQueryParams) {
    return axiosClient.get<undefined, ISuccessResponse<IListResponse<IOrder>>>('/orders', {
      params
    })
  },
  getOrderById(orderId: number) {
    return axiosClient.get<undefined, ISuccessResponse<IOrder>>(`/orders/${orderId}`)
  },
  createOrder(body: ICreateOrderBody) {
    return axiosClient.post<undefined, ISuccessResponse<undefined>>('/orders', body)
  },
  updateOrder({ orderId, body }: { orderId: number; body: IUpdateOrderBody }) {
    return axiosClient.put<undefined, ISuccessResponse<IOrder>>(`/orders/${orderId}`, body)
  },
  deleteOrder(orderId: number) {
    return axiosClient.delete(`/orders/${orderId}`)
  }
}

export default orderApi
