import { createZodDto } from '@anatine/zod-nestjs'
import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(30),
  email: z.string().trim().email(),
  password: z.string().trim().min(6).max(30),
  roleId: z.coerce.number().int().positive()
})

export class CreateUserDto extends createZodDto(createUserSchema) {}
