import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const resetPasswordSchema = extendApi(
  z.object({
    password: z.string().trim().min(6).max(30),
    resetPasswordToken: z.string().trim().min(1)
  })
)

export class ResetPasswordDto extends createZodDto(resetPasswordSchema) {}
