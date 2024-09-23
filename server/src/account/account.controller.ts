import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { JwtDecoded } from '../common/decorators/jwt-decoded.decorator'
import { ResponseMessage } from '../common/decorators/response-message.decorator'
import { SkipEmailVerification } from '../common/decorators/skip-email-verification.decorator'
import { EnumPipe } from '../common/pipes/enum.pipe'
import { OrderStatus } from '../common/types/enum'
import { IJwtDecoded } from '../common/types/interface'
import { ACCOUNT_MESSAGES, ORDER_MESSAGES } from '../common/utils/constants'
import { AccountService } from './account.service'
import { ChangePasswordDto } from './dto/change-password.dto'
import { UpdateMeDto } from './dto/update-me.dto'
import { Public } from '../common/decorators/public.decorator'

@ApiTags('Account')
@SkipEmailVerification()
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ResponseMessage(ACCOUNT_MESSAGES.RETRIEVE_SUCCESS)
  @Get('me')
  getMe(@JwtDecoded() jwtDecoded: IJwtDecoded) {
    return this.accountService.getMe(jwtDecoded.userId)
  }

  @ResponseMessage(ORDER_MESSAGES.GET_LIST_SUCCESS)
  @Get('order')
  getOrder(
    @JwtDecoded() jwtDecoded: IJwtDecoded,
    @Query('status', new EnumPipe(OrderStatus)) status?: OrderStatus
  ) {
    return this.accountService.getOrder(jwtDecoded.userId, status)
  }

  @ResponseMessage(ACCOUNT_MESSAGES.UPDATE_SUCCESS)
  @Put('me')
  updateMe(@Body() updateMeDto: UpdateMeDto, @JwtDecoded() jwtDecoded: IJwtDecoded) {
    return this.accountService.updateMe(updateMeDto, jwtDecoded.userId)
  }

  @ResponseMessage(ACCOUNT_MESSAGES.PASSWORD_CHANGE_SUCCESS)
  @Put('change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @JwtDecoded() jwtDecoded: IJwtDecoded
  ) {
    return this.accountService.changePassword(changePasswordDto, jwtDecoded.userId)
  }

  @ResponseMessage(ACCOUNT_MESSAGES.VERIFICATION_EMAIL_SENT)
  @Post('send-verification-email')
  sendVerificationEmail(@JwtDecoded() jwtDecoded: IJwtDecoded) {
    return this.accountService.sendVerificationEmail(jwtDecoded.userId)
  }

  @ResponseMessage(ACCOUNT_MESSAGES.VERIFICATION_SUCCESS)
  @Public()
  @Post('verify-account')
  verifyAccount(@Body('verificationToken') verificationToken?: string) {
    return this.accountService.verifyAccount(verificationToken)
  }
}
