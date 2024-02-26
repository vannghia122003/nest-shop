import { LoginData, RegisterData, TokenResponse, ResetPasswordData } from '~/types/auth.type'
import { SuccessResponse } from '~/types/response.type'
import http from './http'

const authApi = {
  register(data: RegisterData) {
    return http.post<undefined, SuccessResponse<undefined>>('/auth/register', data)
  },
  login(data: LoginData) {
    return http.post<undefined, SuccessResponse<TokenResponse>>('/auth/login', data)
  },
  logout(data: { refresh_token: string }) {
    return http.post<undefined, SuccessResponse<undefined>>('/auth/logout', data)
  },
  refreshToken(refresh_token: string) {
    return http.post<undefined, SuccessResponse<TokenResponse>>('/auth/refresh-token', {
      refresh_token
    })
  },
  sendVerifyEmail() {
    return http.post<undefined, SuccessResponse<undefined>>('/auth/send-verify-email')
  },
  verifyEmail(email_verify_token: string) {
    return http.post<undefined, SuccessResponse<TokenResponse>>('/auth/verify-email', {
      email_verify_token
    })
  },
  forgotPassword(email: string) {
    return http.post<undefined, SuccessResponse<undefined>>('/auth/forgot-password', {
      email
    })
  },
  resetPassword(data: ResetPasswordData) {
    return http.post<undefined, SuccessResponse<undefined>>('/auth/reset-password', data)
  }
}

export default authApi
