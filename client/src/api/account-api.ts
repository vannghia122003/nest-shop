import axiosClient from '@/api/axios-client'
import { IOrder, OrderStatus } from '@/types/order'
import { ISuccessResponse } from '@/types/response'
import { IChangePasswordBody, IUpdateMeBody, IUser } from '@/types/user'

const accountApi = {
  getMe() {
    return axiosClient.get<undefined, ISuccessResponse<IUser>>('/account/me')
  },
  updateMe(body: IUpdateMeBody) {
    return axiosClient.put<undefined, ISuccessResponse<IUser>>('/account/me', body)
  },
  getOrder(params?: { status?: OrderStatus }) {
    return axiosClient.get<undefined, ISuccessResponse<IOrder[]>>('/account/order', { params })
  },
  changePassword(body: IChangePasswordBody) {
    return axiosClient.put<undefined, ISuccessResponse<undefined>>('/account/change-password', body)
  },
  sendVerificationEmail() {
    return axiosClient.post<undefined, ISuccessResponse<undefined>>(
      '/account/send-verification-email'
    )
  },
  verifyAccount(body: { verificationToken: string }) {
    return axiosClient.post<undefined, ISuccessResponse<undefined>>('/account/verify-account', body)
  }
}

export default accountApi
