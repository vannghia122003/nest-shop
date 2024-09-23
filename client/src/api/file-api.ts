import axiosClient from '@/api/axios-client'
import { ISuccessResponse } from '@/types/response'

const fileApi = {
  uploadImage(body: FormData) {
    return axiosClient.post<undefined, ISuccessResponse<string[]>>('/file/upload-image', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export default fileApi
