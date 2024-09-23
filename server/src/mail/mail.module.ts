import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'
import { Config } from '../config/env.config'
import { MailController } from './mail.controller'
import { MailService } from './mail.service'

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService<Config, true>) => ({
        transport: {
          host: configService.get('EMAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASS')
          }
        },
        defaults: { from: '"Nest Shop" <modules@nestjs.com>' },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true }
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule {}
