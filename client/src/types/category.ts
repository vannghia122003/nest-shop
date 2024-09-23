export interface ICategory {
  id: number
  name: string
  thumbnail: string
  updatedAt: string
  createdAt: string
}

export interface ICreateCategoryBody {
  name: string
  thumbnail: string
}

export interface IUpdateCategoryBody extends Partial<ICreateCategoryBody> {}

export interface ICategoryQueryParams {
  page?: string | number
  limit?: string | number
  sortBy?: 'id:ASC' | 'id:DESC' | 'createdAt:ASC' | 'createdAt:DESC'
  search?: string
  searchBy?: 'name'[]
}
