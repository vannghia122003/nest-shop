import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const deleteProductInCartSchema = extendApi(
  z.object({
    productIds: z.array(z.number().int().positive()).nonempty()
  })
)

export class DeleteProductInCartDto extends createZodDto(deleteProductInCartSchema) {}
