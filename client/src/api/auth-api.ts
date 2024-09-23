import axiosClient from '@/api/axios-client'
import { ILoginBody, ILoginResponse, IRegisterBody, ITokenResponse } from '@/types/auth'
import { ISuccessResponse } from '@/types/response'

const authApi = {
  register(body: IRegisterBody) {
    return axiosClient.post<undefined, ISuccessResponse<undefined>>('/auth/register', body)
  },
  login(body: ILoginBody) {
    return axiosClient.post<undefined, ISuccessResponse<ILoginResponse>>('/auth/login', body)
  },
  logout(body: { refreshToken: string }) {
    return axiosClient.post<undefined, ISuccessResponse<undefined>>('/auth/logout', body)
  },
  refreshToken(body: { refreshToken: string }) {
    return axiosClient.post<undefined, ISuccessResponse<ITokenResponse>>(
      '/auth/refresh-token',
      body
    )
  },
  forgotPassword(body: { email: string }) {
    return axiosClient.post<undefined, ISuccessResponse<undefined>>('/auth/forgot-password', body)
  },
  resetPassword(body: { password: string; resetPasswordToken: string }) {
    return axiosClient.post<undefined, ISuccessResponse<undefined>>('/auth/reset-password', body)
  }
}

export default authApi
