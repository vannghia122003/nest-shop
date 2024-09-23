import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { QueryFailedError, TypeORMError } from 'typeorm'

@Catch(QueryFailedError, TypeORMError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    console.log('🚀 ~ QueryFailedExceptionFilter ~ exception:', exception)
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'queryFailed' })
  }
}
