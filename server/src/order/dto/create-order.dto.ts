import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'

export const createOrderSchema = extendApi(
  z.object({
    province: z.string().trim().min(1),
    district: z.string().trim().min(1),
    ward: z.string().trim().min(1),
    address: z.string().trim().min(1)
  })
)

export class CreateOrderDto extends createZodDto(createOrderSchema) {}
