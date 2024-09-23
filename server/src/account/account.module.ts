import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TokenService } from '../auth/token.service'
import { MailService } from '../mail/mail.service'
import { Order } from '../order/entities/order.entity'
import { User } from '../user/entities/user.entity'
import { AccountController } from './account.controller'
import { AccountService } from './account.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Order])],
  controllers: [AccountController],
  providers: [AccountService, TokenService, MailService]
})
export class AccountModule {}
