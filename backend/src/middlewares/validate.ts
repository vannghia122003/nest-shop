import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { StatusCodes } from 'http-status-codes'
import { ApiError, EntityError } from '~/utils/ApiError'

// sequential processing, stops running validations chain if the previous one fails.
const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)

    // nếu không có lỗi thì next đến middleware tiếp theo
    if (errors.isEmpty()) {
      return next()
    }

    const errorsObject = errors.mapped()
    const entityError = new EntityError({
      message: 'Validation error',
      errors: {}
    })

    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      if (msg instanceof ApiError && msg.status !== StatusCodes.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[key] = errorsObject[key].msg
    }

    next(entityError)
  }
}

export default validate
