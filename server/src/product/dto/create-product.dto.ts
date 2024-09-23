import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const createProductSchema = extendApi(
  z.object({
    name: z.string().trim().min(10),
    description: z.string().trim().min(1),
    thumbnail: z.string().trim().url(),
    discount: z.number().gte(0).lte(100),
    price: z.number().int().nonnegative(),
    rating: z.number().int().positive().lte(5).optional(),
    stock: z.number().int().nonnegative(),
    categoryId: z.number().int().positive(),
    specifications: z.array(
      z.object({
        key: z.string().trim().min(1),
        value: z.string().trim().min(1)
      })
    ),
    photos: z.array(z.string().trim().url())
  })
)

export class CreateProductDto extends createZodDto(createProductSchema) {}
