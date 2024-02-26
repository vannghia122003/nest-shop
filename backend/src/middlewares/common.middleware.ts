import { checkSchema } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { ApiError } from '~/utils/ApiError'
import validate from './validate'

export const validateIdParams = (fields: string[]) => {
  const validateObj = fields.reduce((result: any, value) => {
    result[value] = {
      custom: {
        options: (value: string) => {
          if (!ObjectId.isValid(value)) {
            throw new ApiError({
              status: StatusCodes.BAD_REQUEST,
              message: 'ID không hợp lệ'
            })
          }
          return true
        }
      }
    }
    return result
  }, {})
  return validate(checkSchema(validateObj, ['params']))
}

export const validatePaginationQuery = validate(
  checkSchema(
    {
      limit: {
        optional: true,
        custom: {
          options: async (value) => {
            const limit = Number(value)
            if (isNaN(limit)) {
              throw new ApiError({
                status: StatusCodes.BAD_REQUEST,
                message: 'Limit phải là số'
              })
            }
            if (limit > 100 || limit < 1) {
              throw new ApiError({
                status: StatusCodes.BAD_REQUEST,
                message: 'Limit phải lớn hơn 0 và nhỏ hơn 100'
              })
            }
            return true
          }
        }
      },
      page: {
        optional: true,
        custom: {
          options: async (value) => {
            const page = Number(value)
            if (isNaN(page)) {
              throw new ApiError({
                status: StatusCodes.BAD_REQUEST,
                message: 'Limit phải là số'
              })
            }
            if (page < 1) {
              throw new ApiError({
                status: StatusCodes.BAD_REQUEST,
                message: 'Page phải lớn hơn 0'
              })
            }
            return true
          }
        }
      }
    },
    ['query']
  )
)
