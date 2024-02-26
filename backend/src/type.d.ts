import { Request } from 'express'
import { UserDocument } from './types/document'
import { TokenPayload } from './utils/jwt'

declare module 'express' {
  interface Request {
    user?: UserDocument
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_reset_password_token?: TokenPayload
  }
}
