import { IPermission } from '@/types/permission'

export interface IRole {
  id: number
  name: string
  description: string
  updatedAt: string
  createdAt: string
}

export interface IRoleDetail extends IRole {
  permissions: IPermission[]
}

export interface ICreateRoleBody {
  name: string
  description: string
}

export interface IUpdateRoleBody extends Partial<ICreateRoleBody> {
  permissionIds: number[]
}

export interface IRoleQueryParams {
  page?: string
  limit?: string
  sortBy?: 'id:ASC' | 'id:DESC' | 'createdAt:ASC' | 'createdAt:DESC'
  search?: string
  searchBy?: ('name' | 'description')[]
}
