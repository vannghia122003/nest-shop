import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const forgotPasswordSchema = extendApi(
  z.object({
    email: z.string().trim().email()
  })
)

export class ForgotPasswordDto extends createZodDto(forgotPasswordSchema) {}
