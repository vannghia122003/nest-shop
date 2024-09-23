import axios, { AxiosError, HttpStatusCode } from 'axios'
import { toast } from 'sonner'

import authApi from '@/api/auth-api'
import { IErrorResponse } from '@/types/response'
import { isUnauthorizedError } from '@/utils/error'
import { getItemLocalStorage, logoutLocalStorage, setItemLocalStorage } from '@/utils/helper'

let refreshTokenRequest: Promise<{
  accessToken: string
  refreshToken: string
}> | null = null

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: { indexes: null }
})

axiosClient.interceptors.request.use(
  function (config) {
    const accessToken = getItemLocalStorage('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  function (response) {
    return response.data
  },
  async function (error: AxiosError<IErrorResponse>) {
    if (
      ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(
        error.response!.status
      )
    ) {
      const data = error.response?.data
      const message = data?.message || error.message
      toast.error(message)
    }

    if (isUnauthorizedError<IErrorResponse>(error) && error.config) {
      const config = error.config
      if (error.response?.data.message === 'jwt expired' && config.url !== '/auth/refresh-token') {
        refreshTokenRequest = refreshTokenRequest ? refreshTokenRequest : handleRefreshToken()
        const { accessToken, refreshToken } = await refreshTokenRequest
        refreshTokenRequest = null

        if (config.headers) config.headers.Authorization = accessToken
        if (config.url === '/auth/logout') return authApi.logout({ refreshToken })
        return axiosClient(config)
      }
    }

    return Promise.reject(error)
  }
)

const handleRefreshToken = async () => {
  try {
    const res = await authApi.refreshToken({
      refreshToken: getItemLocalStorage('refreshToken') ?? ''
    })
    const { accessToken, refreshToken } = res.data
    setItemLocalStorage('accessToken', accessToken)
    setItemLocalStorage('refreshToken', refreshToken)
    return { accessToken, refreshToken }
  } catch (error) {
    logoutLocalStorage()
    throw error
  }
}

export default axiosClient
