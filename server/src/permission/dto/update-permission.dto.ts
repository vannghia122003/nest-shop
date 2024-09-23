import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { createPermissionSchema } from './create-permission.dto'

export const updatePermissionSchema = extendApi(createPermissionSchema.partial())

export class UpdatePermissionDto extends createZodDto(updatePermissionSchema) {}
