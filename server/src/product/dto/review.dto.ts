export class ReviewDto {
  id: number
  level: number
  rating: number | null
  comment: string
  updatedAt: Date
  createdAt: Date
}
