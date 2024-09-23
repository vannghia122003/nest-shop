import { ICategory } from '@/types/category'
import { IUser } from '@/types/user'

export interface IProduct {
  id: number
  name: string
  description: string
  thumbnail: string
  price: number
  rating: number
  stock: number
  sold: number
  discount: number
  view: number
  isPublished: boolean
  category: ICategory
  photos: { id: number; url: string }[]
  updatedAt: string
  createdAt: string
}

export interface IProductDetail extends IProduct {
  specifications: { id: number; key: string; value: string }[]
}

export interface ICartItem {
  id: number
  quantity: number
  updatedAt: string
  createdAt: string
  product: IProduct
}

export interface ICreateProductBody {
  name: string
  description: string
  stock: number
  price: number
  discount: number
  thumbnail: string
  categoryId: number
  specifications: { key: string; value: string }[]
  photos: string[]
}

export interface IUpdateProductBody extends Partial<ICreateProductBody> {}

export interface IProductQueryParams {
  page?: string | number
  limit?: string | number
  sortBy?:
    | 'id:ASC'
    | 'id:DESC'
    | 'name:ASC'
    | 'name:DESC'
    | 'createdAt:ASC'
    | 'createdAt:DESC'
    | 'price:ASC'
    | 'price:DESC'
    | 'view:ASC'
    | 'view:DESC'
    | 'sold:ASC'
    | 'sold:DESC'
  search?: string
  searchBy?: 'name' | 'category.id'
  'filter.rating'?: string
  'filter.price'?: string
  'filter.name'?: string
}

export interface IReview {
  id: number
  rating: number
  comment: string
  photos: [{ id: number; url: string }]
  updatedAt: string
  createdAt: string
  user: IUser
}

export interface ICreateReviewBody {
  rating: number | null
  comment: string
  photos: string[]
}

export interface IReviewQueryParams {
  page?: string | number
  limit?: string | number
  sortBy?: 'id:ASC' | 'id:DESC' | 'createdAt:ASC' | 'createdAt:DESC'
  search?: string
  searchBy?: 'rating'
  'filter.parent'?: string
}
