import { SuccessResponse } from '~/types/response.type'
import http from './http'
import {
  User,
  ChangePasswordData,
  UpdateProfileData,
  UserListQuery,
  UserListResponse,
  UpdateUserBody
} from '~/types/user.type'

const userApi = {
  getMe() {
    return http.get<undefined, SuccessResponse<User>>(`/users/me`)
  },
  updateProfile(data: UpdateProfileData) {
    return http.put<undefined, SuccessResponse<User>>('/users/me', data)
  },
  changePassword(data: ChangePasswordData) {
    return http.put<undefined, SuccessResponse<undefined>>('/users/change-password', data)
  },
  uploadImage(data: FormData) {
    return http.post<undefined, SuccessResponse<string[]>>('/users/upload-image', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  getUsers(params: UserListQuery) {
    return http.get<undefined, UserListResponse>('/users', { params })
  },
  getUser(id: string) {
    return http.get<undefined, SuccessResponse<User>>(`/users/${id}`)
  },
  updateUser({ user_id, data }: { user_id: string; data: UpdateUserBody }) {
    return http.put<undefined, SuccessResponse<User>>(`/users/${user_id}`, data)
  },
  deleteUser(id: string) {
    return http.delete(`/users/${id}`)
  }
}

export default userApi
