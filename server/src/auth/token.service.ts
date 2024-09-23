import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JsonWebTokenError, JwtService } from '@nestjs/jwt'
import ms from 'ms'

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async signToken({
    payload,
    secret,
    expiresIn
  }: {
    payload: Buffer | object
    secret: string | Buffer
    expiresIn?: string
  }) {
    try {
      if (expiresIn) {
        return await this.jwtService.signAsync(payload, {
          secret,
          expiresIn: ms(expiresIn) / 1000
        })
      } else {
        return await this.jwtService.signAsync(payload, { secret })
      }
    } catch (error) {
      throw new UnauthorizedException((error as JsonWebTokenError).message)
    }
  }

  async verifyToken<T extends object>({
    token,
    secret,
    errorMessage
  }: {
    token: string
    secret: string | Buffer
    errorMessage?: string
  }) {
    try {
      return await this.jwtService.verifyAsync<T>(token, { secret })
    } catch (error) {
      throw new UnauthorizedException(errorMessage ?? (error as JsonWebTokenError).message)
    }
  }

  decodeToken<T>(token: string) {
    return this.jwtService.decode<T>(token)
  }
}
