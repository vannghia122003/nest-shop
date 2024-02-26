import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import omit from 'lodash/omit'
import env from '~/config/environment'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err.status) err.status = StatusCodes.INTERNAL_SERVER_ERROR

  const responseError = {
    status: err.status,
    message: err.message || StatusCodes[err.status],
    errors: err.errors,
    stack: err.stack
  }

  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  res.status(responseError.status).json(omit(responseError, ['status']))
}
