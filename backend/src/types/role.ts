export interface UpdateRoleReqBody {
  name: string
  permissions: string[]
}

export interface RoleIdReqParams {
  role_id: string
}

export interface CreateRoleReqBody {
  name: string
}
