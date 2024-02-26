import { ObjectId } from 'mongodb'

interface Type {
  _id?: ObjectId
  title: string
  content: string
  image: string
  created_by: ObjectId
  created_at?: Date
}

export default class Notification {
  _id?: ObjectId
  title: string
  content: string
  image: string
  read: ObjectId[]
  created_by: ObjectId
  created_at: Date
  constructor({ _id, title, content, image, created_by, created_at }: Type) {
    this._id = _id
    this.title = title
    this.content = content
    this.image = image
    this.read = []
    this.created_by = created_by
    this.created_at = created_at || new Date()
  }
}
