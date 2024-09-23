export interface ITag {
  id: number
  name: string
  updatedAt: string
  createdAt: string
}

export interface ICreateTagBody {
  name: string
}

export interface IUpdateTagBody extends Partial<ICreateTagBody> {}

export interface ITagQueryParams {
  page?: string | number
  limit?: string | number
  sortBy?: 'id:ASC' | 'id:DESC' | 'name:ASC' | 'name:DESC' | 'createdAt:ASC' | 'createdAt:DESC'
  search?: string
  searchBy?: 'name'
}
