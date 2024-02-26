import { ObjectId } from 'mongodb'

interface Type {
  _id?: ObjectId
  name: string
}

export default class Role {
  _id?: ObjectId
  name: string
  permissions: ObjectId[]
  created_at: Date

  constructor({ _id, name }: Type) {
    this._id = _id || new ObjectId()
    this.name = name
    this.permissions = []
    this.created_at = new Date()
  }
}
