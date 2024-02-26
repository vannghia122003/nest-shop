import { ObjectId } from 'mongodb'

interface Type {
  _id?: ObjectId
  resource: string
  method: string
  module: string
  description: string
}

export default class Permission {
  _id?: ObjectId
  resource: string
  method: string
  module: string
  description: string
  created_at: Date

  constructor(permission: Type) {
    this._id = permission._id
    this.resource = permission.resource
    this.method = permission.method
    this.module = permission.module
    this.description = permission.description
    this.created_at = new Date()
  }
}
