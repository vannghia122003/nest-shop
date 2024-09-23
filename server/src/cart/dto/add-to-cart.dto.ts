import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const addToCartSchema = extendApi(
  z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive()
  })
)

export class AddToCartDto extends createZodDto(addToCartSchema) {}
