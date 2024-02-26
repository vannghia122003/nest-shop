import { ObjectId } from 'mongodb'

interface Type {
  _id?: ObjectId
  name: string
  description: string
  price: number
  quantity: number
  view?: number
  sold?: number
  rating?: number
  review?: number
  image: string
  images?: string[]
  category_id?: string
  created_at?: Date
  updated_at?: Date
}

export default class Product {
  _id?: ObjectId
  name: string
  description: string
  quantity: number
  price: number
  view: number
  sold: number
  rating: number
  review: number
  image: string
  images: string[]
  category_id: ObjectId | null
  created_at: Date
  updated_at: Date
  constructor(product: Type) {
    this._id = product._id
    this.name = product.name
    this.description = product.description
    this.quantity = Number(product.quantity)
    this.price = Number(product.price)
    this.view = Number(product.view) || 0
    this.sold = Number(product.sold) || 0
    this.rating = Number(product.rating) || 0
    this.review = Number(product.review) || 0
    this.image = product.image
    this.images = product.images ? product.images : []
    this.category_id = product.category_id ? new ObjectId(product.category_id) : null
    this.created_at = product.created_at || new Date()
    this.updated_at = product.updated_at || new Date()
  }
}
