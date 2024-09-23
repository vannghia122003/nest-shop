import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const createTagSchema = extendApi(
  z.object({
    name: z.string().trim().min(2).max(50)
  })
)

export class CreateTagDto extends createZodDto(createTagSchema) {}
