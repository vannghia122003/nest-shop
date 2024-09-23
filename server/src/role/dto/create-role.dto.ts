import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const createRoleSchema = extendApi(
  z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(30)
      .transform((val) => val.toUpperCase()),
    description: z.string().trim().min(1).max(100),
    permissionIds: z.array(z.number().int().gt(0))
  })
)

export class CreateRoleDto extends createZodDto(createRoleSchema) {}
