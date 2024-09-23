import { Permission } from '../../permission/entities/permission.entity'

export interface ITokenPayload {
  userId: number
  name: string
  email: string
  role: { id: number; name: string }
}

export interface IJwtDecodedNotPermission extends ITokenPayload {
  exp: number
  iat: number
}

export interface IJwtDecoded extends IJwtDecodedNotPermission {
  isActive: boolean
  permissions: Permission[]
}

export interface IGoogleUserInfo {
  name: string
  email: string
  avatar: string
  isActive: boolean
}
