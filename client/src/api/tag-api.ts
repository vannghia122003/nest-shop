import axiosClient from '@/api/axios-client'
import { IListResponse, ISuccessResponse } from '@/types/response'
import { ICreateTagBody, ITag, ITagQueryParams, IUpdateTagBody } from '@/types/tag'

const tagApi = {
  getAllTags(params?: ITagQueryParams) {
    return axiosClient.get<undefined, ISuccessResponse<IListResponse<ITag>>>('/tags', {
      params
    })
  },
  getTagById(tagId: number) {
    return axiosClient.get<undefined, ISuccessResponse<ITag>>(`/tags/${tagId}`)
  },
  createTag(body: ICreateTagBody) {
    return axiosClient.post<undefined, ISuccessResponse<ITag>>('/tags', body)
  },
  updateTag({ tagId, body }: { tagId: number; body: IUpdateTagBody }) {
    return axiosClient.patch<undefined, ISuccessResponse<ITag>>(`/tags/${tagId}`, body)
  },
  deleteTag(tagId: number) {
    return axiosClient.delete<undefined, ISuccessResponse<ITag>>(`/tags/${tagId}`)
  }
}

export default tagApi
