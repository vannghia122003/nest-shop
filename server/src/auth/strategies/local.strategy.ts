import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AUTH_MESSAGES } from '../../common/utils/constants'
import { AuthService } from '../auth.service'
import { loginSchema } from '../dto/login.dto'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string) {
    try {
      loginSchema.parse({ email, password })
    } catch (error) {
      throw new UnprocessableEntityException(error)
    }
    const user = await this.authService.validateUser(email, password)
    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
    }
    return user
  }
}
