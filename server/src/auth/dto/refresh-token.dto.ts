import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const refreshTokenSchema = extendApi(
  z.object({
    refreshToken: z.string().min(1)
  })
)

export class RefreshTokenDto extends createZodDto(refreshTokenSchema) {}
