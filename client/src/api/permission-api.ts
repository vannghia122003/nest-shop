import axiosClient from '@/api/axios-client'
import {
  ICreatePermissionBody,
  IPermission,
  IPermissionQueryParams,
  IUpdatePermissionBody
} from '@/types/permission'
import { IListResponse, ISuccessResponse } from '@/types/response'

const permissionApi = {
  getAllPermissions(params?: IPermissionQueryParams) {
    return axiosClient.get<undefined, ISuccessResponse<IListResponse<IPermission>>>(
      '/permissions',
      { params }
    )
  },
  getPermissionById(permissionId: number) {
    return axiosClient.get<undefined, ISuccessResponse<IPermission>>(`/permissions/${permissionId}`)
  },
  createPermission(body: ICreatePermissionBody) {
    return axiosClient.post<undefined, ISuccessResponse<IPermission>>('/permissions', body)
  },
  updatePermission({ permissionId, body }: { permissionId: number; body: IUpdatePermissionBody }) {
    return axiosClient.patch<undefined, ISuccessResponse<IPermission>>(
      `/permissions/${permissionId}`,
      body
    )
  },
  deletePermission(permissionId: number) {
    return axiosClient.delete<undefined, ISuccessResponse<IPermission>>(
      `/permissions/${permissionId}`
    )
  }
}

export default permissionApi
