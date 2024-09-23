import { HttpStatus, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { UnprocessableEntityExceptionFilter } from './common/filters/unprocessable-entity.filter'
import { EmailVerifiedGuard } from './common/guards/email-verified.guard'
import { JwtAuthGuard } from './common/guards/jwt-auth.guard'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { ZodPipe } from './common/pipes/zod.pipe'
import { Config } from './config/env.config'
import configSwagger from './config/swagger.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService<Config, true>)
  const reflector = app.get(Reflector)
  const port = configService.get('PORT')

  configSwagger(app)
  app.use(helmet())
  app.useGlobalGuards(new JwtAuthGuard(reflector))
  app.useGlobalGuards(new EmailVerifiedGuard(reflector))
  app.useGlobalPipes(new ZodPipe({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }))
  app.useGlobalFilters(new UnprocessableEntityExceptionFilter())
  app.useGlobalInterceptors(new TransformInterceptor(reflector))

  await app.listen(port, () => {
    Logger.log(`App is running at port: ${port}`)
  })
}
bootstrap()
