import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const changePasswordSchema = extendApi(
  z.object({
    oldPassword: z.string().trim().min(6).max(30),
    newPassword: z.string().trim().min(6).max(30)
  })
)

export class ChangePasswordDto extends createZodDto(changePasswordSchema) {}
