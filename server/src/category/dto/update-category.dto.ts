import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { createCategorySchema } from './create-category.dto'

export const updateCategorySchema = extendApi(createCategorySchema.partial())

export class UpdateCategoryDto extends createZodDto(updateCategorySchema) {}
