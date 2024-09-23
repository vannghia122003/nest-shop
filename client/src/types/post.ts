export interface IPost {
  id: number
  title: string
  description: string
  content: string
  thumbnail: string
  readingTime: number
  tags: [{ id: number; name: string }]
  isPublished: boolean
  view: number
  updatedAt: string
  createdAt: string
  createdBy: {
    id: number
    name: string
    email: string
    avatar: string | null
  }
}

export interface ICreatePostBody {
  title: string
  description: string
  content: string
  thumbnail: string
  tagIds: number[]
}

export interface IUpdatePostBody extends Partial<ICreatePostBody> {
  isPublished?: boolean
}

export interface IPostQueryParams {
  page?: string | number
  limit?: string | number
  sortBy?: 'id:ASC' | 'id:DESC' | 'title:ASC' | 'title:DESC' | 'createdAt:ASC' | 'createdAt:DESC'
  search?: string
  searchBy?: 'title' | 'tags.name'
}
