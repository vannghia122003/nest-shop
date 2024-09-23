import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Config } from '../config/env.config'

@Injectable()
export class MailService {
  constructor(
    private readonly mailService: MailerService,
    private configService: ConfigService<Config, true>
  ) {}

  sendVerificationEmail({
    to,
    subject,
    name,
    titleLink,
    link,
    content
  }: {
    to: string
    subject: string
    name: string
    content: string
    titleLink: string
    link: string
  }) {
    return this.mailService.sendMail({
      to,
      subject,
      template: 'verify-email',
      context: { name, titleLink, link, content }
    })
  }

  sendThankYouEmail({ to, subject }: { to: string; subject: string }) {
    return this.mailService.sendMail({
      to,
      subject,
      template: 'thank-you',
      context: { link: this.configService.get('CLIENT_URL') }
    })
  }
}
