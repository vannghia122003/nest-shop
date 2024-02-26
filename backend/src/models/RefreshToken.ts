import { ObjectId } from 'mongodb'

interface Type {
  _id?: ObjectId
  token: string
  created_at?: Date
  user_id: ObjectId
  exp: number
}

export default class RefreshToken {
  _id?: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId
  exp: Date
  constructor({ _id, token, created_at, user_id, exp }: Type) {
    this._id = _id
    this.token = token
    this.created_at = created_at || new Date()
    this.user_id = user_id
    this.exp = new Date(exp * 1000)
  }
}
