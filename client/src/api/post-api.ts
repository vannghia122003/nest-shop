import axiosClient from '@/api/axios-client'
import { ICreatePostBody, IPost, IPostQueryParams, IUpdatePostBody } from '@/types/post'
import { IListResponse, ISuccessResponse } from '@/types/response'

const postApi = {
  getAllPosts(params?: IPostQueryParams) {
    return axiosClient.get<undefined, ISuccessResponse<IListResponse<IPost>>>('/posts', {
      params
    })
  },
  getPostById(postId: number) {
    return axiosClient.get<undefined, ISuccessResponse<IPost>>(`/posts/${postId}`)
  },
  createPost(body: ICreatePostBody) {
    return axiosClient.post<undefined, ISuccessResponse<IPost>>('/posts', body)
  },
  updatePost({ postId, body }: { postId: number; body: IUpdatePostBody }) {
    return axiosClient.patch<undefined, ISuccessResponse<IPost>>(`/posts/${postId}`, body)
  },
  deletePost(postId: number) {
    return axiosClient.delete<undefined, ISuccessResponse<IPost>>(`/posts/${postId}`)
  }
}

export default postApi
