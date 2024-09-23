import { IRole } from '@/types/role'

export interface IUser {
  id: number
  name: string
  email: string
  dateOfBirth: string | null
  avatar: string | null
  phone: string | null
  address: string | null
  isActive: boolean
  role: IRole
  updatedAt: string
  createdAt: string
}

export interface ICreateUserBody {
  name: string
  email: string
  password: string
  roleId: number
}

export interface IUpdateUserBody extends Partial<ICreateUserBody> {
  avatar?: string
  phone?: string
  address?: string
  dateOfBirth?: string
}

export interface IUpdateMeBody {
  name: string
  phone: string
  address: string
  avatar: string | null
  dateOfBirth: string | null
}

export interface IChangePasswordBody {
  oldPassword: string
  newPassword: string
}

export interface IUserQueryParams {
  page?: string
  limit?: string
  sortBy?: 'id:ASC' | 'id:DESC' | 'name:ASC' | 'name:DESC' | 'createdAt:ASC' | 'createdAt:DESC'
  search?: string
  searchBy?: ('name' | 'email')[]
}
