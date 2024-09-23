import axiosClient from '@/api/axios-client'
import { IListResponse, ISuccessResponse } from '@/types/response'
import {
  ICreateRoleBody,
  IRole,
  IRoleDetail,
  IRoleQueryParams,
  IUpdateRoleBody
} from '@/types/role'

const roleApi = {
  getAllRoles(params?: IRoleQueryParams) {
    return axiosClient.get<undefined, ISuccessResponse<IListResponse<IRole>>>('/roles', { params })
  },
  getRoleById(roleId: number) {
    return axiosClient.get<undefined, ISuccessResponse<IRoleDetail>>(`/roles/${roleId}`)
  },
  createRole(body: ICreateRoleBody) {
    return axiosClient.post<undefined, ISuccessResponse<IRole>>('/roles', body)
  },
  updateRole({ roleId, body }: { roleId: number; body: IUpdateRoleBody }) {
    return axiosClient.patch<undefined, ISuccessResponse<IRole>>(`/roles/${roleId}`, body)
  },
  deleteRole(roleId: number) {
    return axiosClient.delete<undefined, ISuccessResponse<IRole>>(`/roles/${roleId}`)
  }
}

export default roleApi
