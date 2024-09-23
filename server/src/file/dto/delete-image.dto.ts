import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'

import { z } from 'zod'

export const deleteImageSchema = extendApi(
  z.object({
    imageIds: z.array(z.string().min(1)).nonempty()
  })
)

export class DeleteImageDto extends createZodDto(deleteImageSchema) {}
