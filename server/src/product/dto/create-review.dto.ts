import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const createReviewSchema = extendApi(
  z.object({
    rating: z.number().int().positive().lte(5),
    comment: z.string().trim().min(5),
    photos: z.array(z.string().trim().url())
  })
)

export class CreateReviewDto extends createZodDto(createReviewSchema) {}
