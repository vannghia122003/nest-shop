import { ObjectId } from 'mongodb'
import Product from '~/models/Product'
import Permission from '~/models/Permission'

export interface UserDocument {
  _id: ObjectId
  name: string
  email: string
  date_of_birth: Date
  address: string
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string
  reset_password_token: string
  is_email_verified: boolean
  role: {
    _id: ObjectId
    name: string
  }
  phone: string
  avatar: string
}

export interface ProductDocument {
  _id: ObjectId
  name: string
  description: string
  price: number
  quantity: number
  image: string
  view: number
  review: number
  created_at: Date
  updated_at: Date
  category: {
    _id: ObjectId
    name: string
  }
}

export interface CartDocument {
  _id: ObjectId
  user_id: ObjectId
  created_at: Date
  updated_at: Date
  products: { product_id: ObjectId; buy_count: number; product_detail: Product }[]
}

export interface RoleDocument {
  _id: ObjectId
  name: string
  created_at: Date
  updated_at: Date
  permissions: Permission[]
}

export interface NotificationDocument {
  _id: ObjectId
  title: string
  content: string
  image: string
  read: ObjectId[]
  created_by: {
    _id: ObjectId
    name: string
    avatar: string
  }
  created_at?: Date
}
