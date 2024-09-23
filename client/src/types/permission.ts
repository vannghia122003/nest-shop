export interface IPermission {
  id: number
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  module: string
  description: string
  updatedAt: string
  createdAt: string
}

export interface ICreatePermissionBody {
  path: string
  method: string
  module: string
  description: string
}

export interface IUpdatePermissionBody extends Partial<ICreatePermissionBody> {}

export interface IPermissionQueryParams {
  page?: string | number
  limit?: string | number
  sortBy?: 'id:ASC' | 'id:DESC' | 'createdAt:ASC' | 'createdAt:DESC'
  search?: string
  searchBy?: ('module' | 'description')[]
}
