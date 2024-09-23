import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const JwtDecoded = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const jwtDecoded = request.jwtDecoded

  return jwtDecoded
})
