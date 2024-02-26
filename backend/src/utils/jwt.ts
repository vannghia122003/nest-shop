import jwt from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

export interface TokenPayload {
  user_id: string
  token_type: TokenType
  role: {
    _id: string
    name: string
  }
  exp: number
  iat: number
}

export const generateToken = (
  payload: string | object | Buffer,
  privateKey: string,
  tokenExpires?: string | number | undefined
) => {
  return new Promise<string>((resolve, reject) => {
    if (tokenExpires) {
      jwt.sign(
        payload,
        privateKey,
        { algorithm: 'HS256', expiresIn: tokenExpires },
        (err, token) => {
          if (err) {
            return reject(err)
          }
          resolve(token as string)
        }
      )
    } else {
      jwt.sign(payload, privateKey, { algorithm: 'HS256' }, (err, token) => {
        if (err) {
          return reject(err)
        }
        resolve(token as string)
      })
    }
  })
}

export const verifyToken = (token: string, privateKey: string) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, privateKey, function (err, decoded) {
      if (err) {
        return reject(err)
      }
      resolve(decoded as TokenPayload)
    })
  })
}
