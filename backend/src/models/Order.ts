import { ObjectId } from 'mongodb'
import { OrderStatus } from '~/constants/enums'
import { ProductLineItem } from '~/types/product'

interface Type {
  _id?: ObjectId
  user_id: ObjectId
  products: ProductLineItem[]
  total_price: number
  order_date?: Date
  status?: OrderStatus
}

export default class Order {
  _id?: ObjectId
  user_id: ObjectId
  products: ProductLineItem[]
  total_price: number
  order_date: Date
  status: OrderStatus

  constructor(order: Type) {
    this._id = order._id
    this.user_id = order.user_id
    this.products = order.products
    this.total_price = order.total_price
    this.order_date = order.order_date || new Date()
    this.status = order.status || OrderStatus.Processing
  }
}
