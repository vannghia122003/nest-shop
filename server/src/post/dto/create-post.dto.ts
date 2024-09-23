import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const createPostSchema = extendApi(
  z.object({
    title: z.string().trim().min(10),
    content: z.string().trim().min(100),
    thumbnail: z.string().trim().url(),
    description: z.string().trim().min(10),
    tagIds: z.array(z.number().int().positive())
  })
)

export class CreatePostDto extends createZodDto(createPostSchema) {}
