import { ObjectId } from 'mongodb'
import { DEFAULT_IMAGE } from '~/constants/common'

interface Type {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  address: string
  password: string
  created_at?: Date
  updated_at?: Date
  email_verify_token?: string 
  reset_password_token?: string 
  is_email_verified?: boolean
  role_id: ObjectId
  phone?: string
  avatar?: string
}

export default class User {
  _id?: ObjectId
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
  role_id: ObjectId
  avatar: string
  phone: string

  constructor(user: Type) {
    const date = new Date()
    this._id = user._id
    this.name = user.name
    this.email = user.email
    this.password = user.password
    this.date_of_birth = user.date_of_birth || new Date()
    this.address = user.address || ''
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
    this.email_verify_token = user.email_verify_token || ''
    this.reset_password_token = user.reset_password_token || ''
    this.is_email_verified = user.is_email_verified || false
    this.role_id = user.role_id
    this.avatar = user.avatar || DEFAULT_IMAGE
    this.phone = user.phone || ''
  }
}
