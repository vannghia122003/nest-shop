import { patchNestjsSwagger } from '@anatine/zod-nestjs'
import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

const configSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Nest Shop API')
    .setDescription('The Nest Shop API description')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header'
      },
      'token'
    )
    .addSecurityRequirements('token')
    .build()
  patchNestjsSwagger()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: { persistAuthorization: true }
  })
}

export default configSwagger
