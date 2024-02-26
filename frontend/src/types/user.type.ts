import { SuccessResponse } from './response.type'

export interface User {
  _id: string
  name: string
  email: string
  date_of_birth: string // ISO8601
  address: string
  is_email_verified: boolean
  avatar: string
  phone: string
  createdAt: string
  updatedAt: string
  role: {
    _id: string
    name: string
  }
}

export interface UserListResponse extends SuccessResponse<User[]> {
  page: number
  total_pages: number
  total_results: number
}

export interface UserListQuery {
  page?: number | string
  limit?: number | string
}

export interface UpdateProfileData {
  name?: string
  date_of_birth?: string
  address?: string
  avatar?: string
  phone?: string
}

export interface ChangePasswordData {
  old_password: string
  password: string
  confirm_password: string
}

export interface UpdateUserBody {
  address?: string
  avatar?: string
  date_of_birth?: string
  name?: string
  phone?: string
  role_id?: string
}
