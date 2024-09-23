import axiosClient from '@/api/axios-client'
import { IListResponse, ISuccessResponse } from '@/types/response'
import { ICreateUserBody, IUpdateUserBody, IUser, IUserQueryParams } from '@/types/user'

const userApi = {
  getAllUsers(params?: IUserQueryParams) {
    return axiosClient.get<undefined, ISuccessResponse<IListResponse<IUser>>>('/users', { params })
  },
  getUserById(userId: number) {
    return axiosClient.get<undefined, ISuccessResponse<IUser>>(`/users/${userId}`)
  },
  createUser(body: ICreateUserBody) {
    return axiosClient.post<undefined, ISuccessResponse<IUser>>('/users', body)
  },
  updateUser({ userId, body }: { userId: number; body: IUpdateUserBody }) {
    return axiosClient.patch<undefined, ISuccessResponse<IUser>>(`/users/${userId}`, body)
  },
  deleteUser(userId: number) {
    return axiosClient.delete(`/users/${userId}`)
  }
}

export default userApi
