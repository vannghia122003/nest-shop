import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailService } from '../mail/mail.service'
import { Permission } from '../permission/entities/permission.entity'
import { Role } from '../role/entities/role.entity'
import { User } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { RefreshToken } from './entities/refresh-token.entity'
import { GoogleStrategy } from './strategies/google.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { TokenService } from './token.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, RefreshToken, Role, Permission]), PassportModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    TokenService,
    MailService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy
  ]
})
export class AuthModule {}
