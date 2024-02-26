import { ObjectId } from 'mongodb'

interface Type {
  _id?: ObjectId
  name: string
  image: string
  created_at?: Date
  updated_at?: Date
}

export default class Category {
  _id?: ObjectId
  name: string
  image: string
  created_at?: Date
  updated_at?: Date
  constructor({ _id, name, image, created_at, updated_at }: Type) {
    this._id = _id
    this.name = name
    this.image = image
    this.created_at = created_at || new Date()
    this.updated_at = updated_at || new Date()
  }
}
