import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { createRoleSchema } from './create-role.dto'

export const updateRoleSchema = extendApi(createRoleSchema.partial())

export class UpdateRoleDto extends createZodDto(updateRoleSchema) {}
