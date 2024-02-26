import { ObjectId } from 'mongodb'
import { ProductLineItem } from '~/types/product'

interface Type {
  _id?: ObjectId
  user_id: ObjectId
  products?: ProductLineItem[]
}

export default class Cart {
  _id?: ObjectId
  user_id: ObjectId
  products: ProductLineItem[]

  constructor(cart: Type) {
    this._id = cart._id || new ObjectId()
    this.user_id = cart.user_id
    this.products = cart.products || []
  }
}
