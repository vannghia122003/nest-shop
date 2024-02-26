import { SuccessResponse } from '~/types/response.type'
import http from './http'
import { Role, CreateRoleBody, UpdateRoleBody, Permission } from '~/types/role.type'

const roleApi = {
  createRole(data: CreateRoleBody) {
    return http.post<undefined, SuccessResponse<Role>>('/roles', data)
  },
  getRoles() {
    return http.get<undefined, SuccessResponse<Role[]>>('/roles')
  },
  getRole(role_id: string) {
    return http.get<undefined, SuccessResponse<Role>>(`/roles/${role_id}`)
  },
  deleteRole(role_id: string) {
    return http.delete(`/roles/${role_id}`)
  },
  updateRole({ role_id, data }: { role_id: string; data: UpdateRoleBody }) {
    return http.put<undefined, SuccessResponse<Role>>(`/roles/${role_id}`, data)
  },
  getPermissions() {
    return http.get<undefined, SuccessResponse<Permission>>('/permissions')
  }
}

export default roleApi
