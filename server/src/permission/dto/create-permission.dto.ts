import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const createPermissionSchema = extendApi(
  z.object({
    path: z.string().trim().min(1),
    method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
    module: z.string().trim().min(1),
    description: z.string().trim().min(1)
  })
)

export class CreatePermissionDto extends createZodDto(createPermissionSchema) {}
