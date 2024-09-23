import { ZodDtoStatic, ZodValidationPipe } from '@anatine/zod-nestjs'
import { ArgumentMetadata, UnprocessableEntityException } from '@nestjs/common'

export class ZodPipe extends ZodValidationPipe {
  async transform(value: unknown, metadata: ArgumentMetadata) {
    const zodSchema = (metadata.metatype as ZodDtoStatic)?.zodSchema
    if (zodSchema) {
      try {
        return zodSchema.parse(value)
      } catch (error) {
        throw new UnprocessableEntityException(error)
      }
    }
    return value
  }
}
