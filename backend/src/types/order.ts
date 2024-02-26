import { OrderStatus } from '~/constants/enums'
import { PaginationReqQuery } from './common'

export interface UpdateOrderReqBody {
  status: OrderStatus
}

export interface GetOrdersReqQuery extends PaginationReqQuery {
  status: OrderStatus
}

export interface OrderIdReqParams {
  order_id: string
}
