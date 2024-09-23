import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const createCategorySchema = extendApi(
  z.object({
    name: z.string().trim().min(2).max(30),
    thumbnail: z.string().trim().url()
  })
)

export class CreateCategoryDto extends createZodDto(createCategorySchema) {}
