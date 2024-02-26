export interface RegisterData {
  name: string
  email: string
  password: string
  confirm_password: string
  address: string
}

export interface LoginData {
  email: string
  password: string
}

export interface ResetPasswordData {
  reset_password_token: string
  password: string
  confirm_password: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
}

export interface TokenPayload {
  user_id: string
  token_type: number
  role: {
    _id: string
    name: string
  }
  iat: number
  exp: number
}
