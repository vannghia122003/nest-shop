import { IUser } from '@/types/user'

export interface ITokenResponse {
  accessToken: string
  refreshToken: string
}

export interface ILoginResponse extends ITokenResponse {
  user: IUser
}

export interface IRegisterBody {
  name: string
  email: string
  password: string
}

export interface ILoginBody {
  email: string
  password: string
}
