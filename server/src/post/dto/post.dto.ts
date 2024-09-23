class TagDto {
  id: number
  name: string
}

export class PostDto {
  id: number
  title: string
  content: string
  thumbnail: string
  isPublished: boolean
  readingTime: number
  view: number
  updatedAt: Date
  createdAt: Date
  createdBy: { id: number; name: string; email: string; avatar: string }
  tags: TagDto[]
}
