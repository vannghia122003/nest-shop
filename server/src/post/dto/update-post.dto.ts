import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'
import { createPostSchema } from './create-post.dto'

export const updatePostSchema = extendApi(
  createPostSchema
    .extend({
      isPublished: z.boolean()
    })
    .partial()
)

export class UpdatePostDto extends createZodDto(updatePostSchema) {}
