import axios, { AxiosError, HttpStatusCode, InternalAxiosRequestConfig } from 'axios'
import config from '~/constants/config'
import {
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage
} from '~/utils/auth'
import { isUnauthorizedError } from '~/utils/errors'
import authApi from './auth.api'
import { toast } from 'react-toastify'

let refreshTokenRequest: Promise<{
  access_token: string
  refresh_token: string
}> | null = null

const http = axios.create({
  baseURL: config.api_url,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

http.interceptors.request.use(
  function (config) {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  function (response) {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với dữ liệu response
    return response.data
  },
  async function (error: AxiosError) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
    // Làm gì đó với lỗi response
    if (
      ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(
        error.response?.status as number
      )
    ) {
      const data: any | undefined = error.response?.data
      const message = data?.message || error.message
      toast.error(message)
    }

    if (isUnauthorizedError<{ status: number; message: string }>(error)) {
      const config = error.config
      if (
        error.response?.data.message === 'jwt expired' &&
        config?.url !== '/auth/refresh-token' &&
        config?.url !== '/auth/verify-email'
      ) {
        refreshTokenRequest = refreshTokenRequest ? refreshTokenRequest : handleRefreshToken()
        const { access_token, refresh_token } = await refreshTokenRequest
        refreshTokenRequest = null
        if (config?.headers) config.headers.Authorization = access_token
        if (config?.url === '/auth/logout') return authApi.logout({ refresh_token })

        return http(config as InternalAxiosRequestConfig)
      }
    }
    return Promise.reject(error)
  }
)

const handleRefreshToken = async () => {
  const refreshToken = getRefreshTokenFromLocalStorage()
  try {
    const res = await authApi.refreshToken(refreshToken)
    const { access_token, refresh_token } = res.result
    setAccessTokenToLocalStorage(access_token)
    setRefreshTokenToLocalStorage(refresh_token)
    return {
      access_token,
      refresh_token
    }
  } catch (error) {
    clearLocalStorage()
    throw error
  }
}

export default http
