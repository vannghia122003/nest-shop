import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'
import { Config } from '../../config/env.config'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService<Config, true>) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile']
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) {
    const { name, email, picture, email_verified } = profile._json
    const user = { name, email, avatar: picture, isActive: email_verified }
    return user
  }
}
