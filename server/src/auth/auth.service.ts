import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { randomUUID } from 'crypto'
import omit from 'lodash/omit'
import { LessThan, Repository } from 'typeorm'
import { DefaultRole } from '../common/types/enum'
import { IGoogleUserInfo, IJwtDecodedNotPermission, ITokenPayload } from '../common/types/interface'
import { compareHash, hashString } from '../common/utils/bcrypt'
import { AUTH_MESSAGES } from '../common/utils/constants'
import { Config } from '../config/env.config'
import { MailService } from '../mail/mail.service'
import { Role } from '../role/entities/role.entity'
import { User } from '../user/entities/user.entity'
import { UserService } from '../user/user.service'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { RegisterDto } from './dto/register.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { RefreshToken } from './entities/refresh-token.entity'
import { TokenService } from './token.service'

@Injectable()
export class AuthService {
  constructor(
    private mailService: MailService,
    private userService: UserService,
    private tokenService: TokenService,
    private configService: ConfigService<Config, true>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'name',
        'email',
        'password',
        'isActive',
        'avatar',
        'phone',
        'address',
        'dateOfBirth',
        'createdAt',
        'updatedAt',
        'role'
      ],
      relations: { role: true }
    })
    if (user && compareHash(password, user.password)) return user
    return null
  }

  signAccessAndRefreshToken(payload: ITokenPayload) {
    return Promise.all([
      this.tokenService.signToken({
        payload,
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES')
      }),
      this.tokenService.signToken({
        payload,
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES')
      })
    ])
  }

  async register(registerDto: RegisterDto) {
    const [role] = await Promise.all([
      this.roleRepository.findOneBy({ name: DefaultRole.CUSTOMER }),
      this.userService.checkEmailExists(registerDto.email)
    ])
    await this.userRepository.save({
      ...registerDto,
      password: hashString(registerDto.password),
      role: role!
    })
  }

  async login(user: User) {
    const payload: ITokenPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: { id: user.role.id, name: user.role.name }
    }
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(payload)
    const { exp } = this.tokenService.decodeToken<IJwtDecodedNotPermission>(refreshToken)
    await this.refreshTokenRepository.save({
      token: refreshToken,
      user: { id: user.id },
      expiresAt: new Date(exp * 1000)
    })
    return { accessToken, refreshToken, user: omit(user, ['password']) }
  }

  async refreshToken({ refreshToken: token }: RefreshTokenDto) {
    if (!token) throw new UnauthorizedException(AUTH_MESSAGES.REFRESH_TOKEN_IS_REQUIRED)

    const { userId, exp } = await this.tokenService.verifyToken<IJwtDecodedNotPermission>({
      token,
      secret: this.configService.get('REFRESH_TOKEN_SECRET')
    })

    const isTokenExists = await this.refreshTokenRepository.findOne({
      where: { user: { id: userId }, token },
      relations: { user: { role: true } }
    })
    if (!isTokenExists) throw new UnauthorizedException(AUTH_MESSAGES.REFRESH_TOKEN_DOES_NOT_EXIST)

    const user = isTokenExists.user
    const payload: ITokenPayload = {
      userId,
      name: user.name,
      email: user.email,
      role: { id: user.role.id, name: user.role.name }
    }
    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.tokenService.signToken({
        payload,
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES')
      }),
      this.tokenService.signToken({
        payload: { ...payload, exp },
        secret: this.configService.get('REFRESH_TOKEN_SECRET')
      }),
      this.refreshTokenRepository.delete({ token })
    ])

    await this.refreshTokenRepository.save({
      token: newRefreshToken,
      user: { id: userId },
      expiresAt: new Date(exp * 1000)
    })

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  async logout({ refreshToken }: RefreshTokenDto) {
    await this.tokenService.verifyToken({
      token: refreshToken,
      secret: this.configService.get('REFRESH_TOKEN_SECRET')
    })
    await this.refreshTokenRepository.delete({ token: refreshToken })
  }

  async googleLogin(req) {
    const googleUserInfo = req.user as IGoogleUserInfo | null
    if (!googleUserInfo) throw new UnauthorizedException('No user from google')

    const user = await this.userRepository.findOne({
      where: { email: googleUserInfo.email },
      relations: { role: true }
    })
    if (user) {
      const payload: ITokenPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: { id: user.role.id, name: user.role.name }
      }
      const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(payload)
      const { exp } = this.tokenService.decodeToken<IJwtDecodedNotPermission>(refreshToken)
      await this.refreshTokenRepository.save({
        token: refreshToken,
        user: { id: user.id },
        expiresAt: new Date(exp * 1000)
      })
      return { accessToken, refreshToken }
    } else {
      const role = await this.roleRepository.findOneBy({ name: DefaultRole.CUSTOMER })
      const newUser = await this.userRepository.save({
        name: googleUserInfo.name,
        email: googleUserInfo.email,
        password: hashString(randomUUID()),
        avatar: googleUserInfo.avatar,
        isActive: googleUserInfo.isActive,
        role: role!
      })
      const payload: ITokenPayload = {
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: { id: newUser.role.id, name: newUser.role.name }
      }
      const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(payload)
      const { exp } = this.tokenService.decodeToken<IJwtDecodedNotPermission>(refreshToken)
      await this.refreshTokenRepository.save({
        token: refreshToken,
        user: { id: newUser.id },
        expiresAt: new Date(exp * 1000)
      })
      return { accessToken, refreshToken }
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordDto.email },
      relations: { role: true }
    })
    if (!user) throw new NotFoundException('Email does not exist')
    const payload: ITokenPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: { id: user.role.id, name: user.role.name }
    }
    const resetPasswordToken = await this.tokenService.signToken({
      payload,
      secret: this.configService.get('RESET_PASSWORD_TOKEN_SECRET'),
      expiresIn: this.configService.get('RESET_PASSWORD_TOKEN_EXPIRES')
    })
    this.mailService.sendVerificationEmail({
      to: user.email,
      subject: 'Reset Password',
      name: user.name,
      content: 'Click the button below to reset your password.',
      titleLink: 'Reset password',
      link: `${this.configService.get('CLIENT_URL')}/reset-password?resetPasswordToken=${resetPasswordToken}`
    })
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { userId } = await this.tokenService.verifyToken<IJwtDecodedNotPermission>({
      token: resetPasswordDto.resetPasswordToken,
      secret: this.configService.get('RESET_PASSWORD_TOKEN_SECRET'),
      errorMessage: AUTH_MESSAGES.INVALID_RESET_PASSWORD_TOKEN
    })
    await this.userRepository.update(userId, { password: hashString(resetPasswordDto.password) })
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  autoRemoveRefreshToken() {
    this.refreshTokenRepository.delete({ expiresAt: LessThan(new Date()) })
  }
}
