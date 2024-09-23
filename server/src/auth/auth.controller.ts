import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { Public } from '../common/decorators/public.decorator'
import { ResponseMessage } from '../common/decorators/response-message.decorator'
import { SkipEmailVerification } from '../common/decorators/skip-email-verification.decorator'
import { GoogleAuthGuard } from '../common/guards/google-auth.guard'
import { LocalAuthGuard } from '../common/guards/local-auth.guard'
import { AUTH_MESSAGES } from '../common/utils/constants'
import { Config } from '../config/env.config'
import { AuthService } from './auth.service'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { RegisterDto } from './dto/register.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService<Config, true>
  ) {}

  @ResponseMessage(AUTH_MESSAGES.REGISTER_SUCCESS)
  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @ResponseMessage(AUTH_MESSAGES.LOGIN_SUCCESS)
  @ApiBody({ type: LoginDto })
  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user)
  }

  @ResponseMessage(AUTH_MESSAGES.LOGOUT_SUCCESS)
  @HttpCode(HttpStatus.OK)
  @SkipEmailVerification()
  @Post('logout')
  logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto)
  }

  @ResponseMessage(AUTH_MESSAGES.REFRESH_TOKEN_SUCCESS)
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto)
  }

  @ResponseMessage(AUTH_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD)
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto)
  }

  @ResponseMessage(AUTH_MESSAGES.RESET_PASSWORD_SUCCESS)
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto)
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  googleAuth() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google-redirect')
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const data = await this.authService.googleLogin(req)
    const url = `${this.configService.get('GOOGLE_REDIRECT_CLIENT_URL')}?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`
    return res.redirect(url)
  }
}
