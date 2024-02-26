import { ObjectId } from 'mongodb'

export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string
  address?: string
  avatar?: string
  phone?: string
}

export interface ChangePasswordReqBody {
  old_password: string
  password: string
  confirm_password: string
}

export interface UpdateUserReqBody {
  name?: string
  date_of_birth?: string
  address?: string
  avatar?: string
  phone?: string
  role_id?: string
}

export interface UpdateUserType extends Omit<UpdateUserReqBody, 'role_id' | 'date_of_birth'> {
  role_id?: ObjectId
  date_of_birth?: Date
}

export interface UpdateMeType extends Omit<UpdateMeReqBody, 'date_of_birth'> {
  date_of_birth?: Date
}

export interface UserIdReqParams {
  user_id: string
}
