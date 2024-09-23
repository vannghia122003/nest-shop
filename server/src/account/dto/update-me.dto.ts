import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'
import { ACCOUNT_MESSAGES } from '../../common/utils/constants'
import { PHONE_NUMBER_REGEX } from '../../common/utils/regex'

export const updateMeSchema = extendApi(
  z.object({
    name: z.string().trim().min(2).max(30),
    avatar: z.string().trim().url().nullable(),
    phone: z
      .string()
      .trim()
      .refine((value) => PHONE_NUMBER_REGEX.test(value), {
        message: ACCOUNT_MESSAGES.INVALID_PHONE_NUMBER
      }),
    address: z.string().trim().min(1).max(50),
    dateOfBirth: z.string().trim().datetime().nullable()
  })
)

export class UpdateMeDto extends createZodDto(updateMeSchema) {}
