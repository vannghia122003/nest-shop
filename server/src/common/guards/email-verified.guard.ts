import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { SKIP_EMAIL_VERIFICATION_KEY } from '../decorators/skip-email-verification.decorator'
import { AUTH_MESSAGES } from '../utils/constants'

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const jwtDecoded = request.jwtDecoded
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    const skipEmailVerification = this.reflector.getAllAndOverride<boolean>(
      SKIP_EMAIL_VERIFICATION_KEY,
      [context.getHandler(), context.getClass()]
    )
    if (isPublic || skipEmailVerification || jwtDecoded.isActive) return true

    throw new ForbiddenException(AUTH_MESSAGES.EMAIL_NOT_VERIFIED)
  }
}
