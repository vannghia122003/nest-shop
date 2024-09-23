import { ArgumentsHost, Catch, ExceptionFilter, UnprocessableEntityException } from '@nestjs/common'
import { Response } from 'express'
import { STATUS_CODES } from 'http'
import { ZodError } from 'zod'

@Catch(UnprocessableEntityException)
export class UnprocessableEntityExceptionFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()

    const message = (exception.getResponse() as ZodError).errors.map((issue) => ({
      ...issue,
      field: issue.path.join('.')
    }))

    response.status(status).json({
      message,
      error: STATUS_CODES[status],
      statusCode: status
    })
  }
}
