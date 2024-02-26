import { ObjectId } from 'mongodb'

interface Type {
  _id?: ObjectId
  user_id: string
  product_id: string
  comment: string
  rating: number
  review_date?: Date
}

export default class Review {
  _id: ObjectId
  user_id: ObjectId
  product_id: ObjectId
  comment: string
  rating: number
  review_date: Date

  constructor(review: Type) {
    this._id = review._id || new ObjectId()
    this.user_id = new ObjectId(review.user_id)
    this.product_id = new ObjectId(review.product_id)
    this.comment = review.comment
    this.rating = review.rating
    this.review_date = review.review_date || new Date()
  }
}
