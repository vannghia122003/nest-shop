import { StatusCodes } from 'http-status-codes'

type ErrorsType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

/* {
  [key: string]: {
    msg: string
    location: string
    value: any
  } 
 } */

export class ApiError {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    // super(message)
    this.message = message
    this.status = status
    Error.captureStackTrace(this, this.constructor)
  }
}

export class EntityError extends ApiError {
  errors: ErrorsType
  constructor({ message = 'Validation Error', errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status: StatusCodes.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
