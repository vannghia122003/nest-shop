import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'
import { ACCOUNT_MESSAGES } from '../../common/utils/constants'
import { PHONE_NUMBER_REGEX } from '../../common/utils/regex'
import { createUserSchema } from './create-user.dto'

export const updateUserSchema = extendApi(
  createUserSchema
    .extend({
      avatar: z.string().trim().url().nullable(),
      phone: z
        .string()
        .trim()
        .refine((val) => PHONE_NUMBER_REGEX.test(val), {
          message: ACCOUNT_MESSAGES.INVALID_PHONE_NUMBER
        })
        .nullable(),
      address: z.string().trim().min(1).max(50).nullable(),
      dateOfBirth: z.string().trim().datetime().nullable()
    })
    .omit({ email: true })
    .partial()
)

export class UpdateUserDto extends createZodDto(updateUserSchema) {}
