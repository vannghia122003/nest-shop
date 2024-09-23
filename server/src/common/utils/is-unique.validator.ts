import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator'
import { EntityManager } from 'typeorm'

@ValidatorConstraint({ name: 'IsUniqueConstraint', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {}
  async validate(value, args?: ValidationArguments) {
    const [tableName, column, transformFn] = args!.constraints
    const dataExist = await this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName)
      .where({ [column]: transformFn ? transformFn(value) : value })
      .getExists()

    return !dataExist
  }

  defaultMessage(args?: ValidationArguments): string {
    return `${args?.property} is already exist`
  }
}

export function IsUnique(
  [tableName, column]: [string, string],
  transformFn?: (data: string) => string,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [tableName, column, transformFn],
      validator: IsUniqueConstraint
    })
  }
}
