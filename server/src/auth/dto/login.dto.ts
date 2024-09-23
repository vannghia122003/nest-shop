import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const loginSchema = extendApi(
  z.object({
    email: z.string().email(),
    password: z.string().min(6).max(30)
  })
)

export class LoginDto extends createZodDto(loginSchema) {}
