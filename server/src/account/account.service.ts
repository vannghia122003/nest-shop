import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { z } from 'zod'
import { TokenService } from '../auth/token.service'
import { DefaultRole, OrderStatus } from '../common/types/enum'
import { IJwtDecodedNotPermission, ITokenPayload } from '../common/types/interface'
import { compareHash, hashString } from '../common/utils/bcrypt'
import { ACCOUNT_MESSAGES, AUTH_MESSAGES, USER_MESSAGES } from '../common/utils/constants'
import { Config } from '../config/env.config'
import { MailService } from '../mail/mail.service'
import { Order } from '../order/entities/order.entity'
import { User } from '../user/entities/user.entity'
import { ChangePasswordDto } from './dto/change-password.dto'
import { UpdateMeDto } from './dto/update-me.dto'

@Injectable()
export class AccountService {
  constructor(
    private mailService: MailService,
    private tokenService: TokenService,
    private configService: ConfigService<Config, true>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>
  ) {}

  getMe(userId: number) {
    return this.userRepository.findOne({ where: { id: userId }, relations: { role: true } })
  }

  async updateMe(updateMeDto: UpdateMeDto, userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) throw new NotFoundException(ACCOUNT_MESSAGES.USER_NOT_FOUND)
    if (user.name === DefaultRole.ADMIN)
      throw new ForbiddenException(AUTH_MESSAGES.PERMISSIONS_DENIED)
    await this.userRepository.save({ ...user, ...updateMeDto })
    return await this.userRepository.findOne({ where: { id: userId }, relations: { role: true } })
  }

  async getOrder(userId: number, status?: OrderStatus) {
    return await this.orderRepository.find({
      where: { user: { id: userId }, status },
      order: { createdAt: 'DESC' },
      relations: { ordersItem: { product: true } }
    })
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: number) {
    const user = (await this.userRepository.findOne({
      where: { id: userId },
      select: { id: true, name: true, password: true }
    })) as { id: number; name: string; password: string }
    if (!user) throw new NotFoundException(ACCOUNT_MESSAGES.USER_NOT_FOUND)

    try {
      const schema = z.string().refine((oldPassword) => compareHash(oldPassword, user.password), {
        message: ACCOUNT_MESSAGES.INVALID_PASSWORD,
        path: ['oldPassword']
      })
      await schema.parseAsync(changePasswordDto.oldPassword)
    } catch (error) {
      throw new UnprocessableEntityException(error)
    }

    user.password = hashString(changePasswordDto.newPassword)
    await this.userRepository.save(user)
  }

  async sendVerificationEmail(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { role: true }
    })
    if (!user) throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
    if (user.isActive) {
      throw new BadRequestException(ACCOUNT_MESSAGES.USER_IS_ALREADY_VERIFIED)
    }
    const payload: ITokenPayload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: { id: user.role.id, name: user.role.name }
    }
    const verificationToken = await this.tokenService.signToken({
      payload,
      secret: this.configService.get('EMAIL_VERIFICATION_TOKEN_SECRET'),
      expiresIn: this.configService.get('EMAIL_VERIFICATION_TOKEN_EXPIRES')
    })
    await this.mailService.sendVerificationEmail({
      to: user.email,
      subject: 'Confirm Your Account to Get Started',
      name: user.name,
      content:
        "Thanks for registering an account with Nest Shop! Before we get started, we'll need to verify your email.",
      titleLink: 'Verify email',
      link: `${this.configService.get('CLIENT_URL')}/verify-account?verificationToken=${verificationToken}`
    })
  }

  async verifyAccount(verificationToken?: string) {
    if (!verificationToken) {
      throw new UnauthorizedException(ACCOUNT_MESSAGES.INVALID_VERIFICATION_TOKEN)
    } else {
      const { userId } = await this.tokenService.verifyToken<IJwtDecodedNotPermission>({
        token: verificationToken,
        secret: this.configService.get('EMAIL_VERIFICATION_TOKEN_SECRET'),
        errorMessage: ACCOUNT_MESSAGES.INVALID_VERIFICATION_TOKEN
      })
      await this.userRepository.update(userId, { isActive: true })
    }
  }
}
