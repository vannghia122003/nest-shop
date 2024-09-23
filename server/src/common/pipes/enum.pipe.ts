import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'

@Injectable()
export class EnumPipe implements PipeTransform {
  constructor(private readonly enumType: object) {}

  transform(value: any) {
    if (value) {
      const enumValues = Object.values(this.enumType)
      if (!enumValues.includes(value)) {
        throw new BadRequestException(`'${value}' is not a valid enum value.`)
      }
    }

    return value
  }
}
