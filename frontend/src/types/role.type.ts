export interface Role {
  _id: string
  name: string
  permissions: Permission[]
  created_at: string
}

export interface CreateRoleBody {
  name: string
}

export interface UpdateRoleBody {
  name: string
  permissions: string[]
}

export interface Permission {
  _id: string
  resource: string
  method: string
  module: string
  description: string
  created_at: string
}

export enum Roles {
  SuperAdmin = 'super admin',
  Staff = 'staff',
  Customer = 'customer'
}
