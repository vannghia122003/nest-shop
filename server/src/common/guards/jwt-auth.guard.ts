import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { DefaultRole } from '../types/enum'
import { AUTH_MESSAGES } from '../utils/constants'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super({ property: 'jwtDecoded' })
  }

  handleRequest(err, jwtDecoded, info, context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (!jwtDecoded && isPublic) return true

    if (err || !jwtDecoded) {
      throw err || new UnauthorizedException(info.message)
    }

    const request = context.switchToHttp().getRequest<Request>()
    const method = request.method
    const path = request.route.path as string
    const { role, permissions } = jwtDecoded
    const nonSecurePaths = ['/auth', '/account', '/dashboard']

    if (role.name === DefaultRole.ADMIN) return jwtDecoded
    if (nonSecurePaths.some((item) => path.startsWith(item))) return jwtDecoded
    if (permissions.some((p) => p.path === path && p.method === method)) return jwtDecoded
    throw new ForbiddenException(AUTH_MESSAGES.ACCESS_DENIED)
  }
}
