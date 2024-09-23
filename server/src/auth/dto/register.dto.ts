import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const registerSchema = extendApi(
  z.object({
    name: z.string().trim().min(2).max(30),
    email: z.string().trim().email(),
    password: z.string().trim().min(6).max(30)
  })
)

export class RegisterDto extends createZodDto(registerSchema) {}
