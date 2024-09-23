import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'
import { OrderStatus } from '../../common/types/enum'

export const updateOrderSchema = extendApi(
  z.object({
    status: z.nativeEnum(OrderStatus)
  })
)

export class UpdateOrderDto extends createZodDto(updateOrderSchema) {}
