import { createZodDto } from '@anatine/zod-nestjs'
import { createTagSchema } from './create-tag.dto'

export const updateTagSchema = createTagSchema.partial()

export class UpdateTagDto extends createZodDto(updateTagSchema) {}
