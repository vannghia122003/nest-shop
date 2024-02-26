import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { StatusCodes } from 'http-status-codes'
import { AUTH_MESSAGES } from '~/constants/messages'
import authService from '~/services/auth.service'
import userService from '~/services/user.service'
import { UserDocument } from '~/types/document'
import {
  ForgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  VerifyEmailReqBody
} from '~/types/auth'
import { ApiError } from '~/utils/ApiError'
import { TokenPayload } from '~/utils/jwt'

const authController = {
  async register(req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) {
    const result = await authService.register(req.body)
    res.status(StatusCodes.CREATED).json(result)
  },

  async login(req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) {
    const result = await authService.login(req.body)
    res.json({
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      result
    })
  },

  async logout(req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) {
    const refresh_token = req.body.refresh_token
    const result = await authService.logout(refresh_token)
    res.json(result)
  },

  async refreshToken(req: Request<ParamsDictionary, any, RefreshTokenReqBody>, res: Response) {
    const { user_id, exp, role } = req.decoded_refresh_token as TokenPayload
    const { refresh_token } = req.body
    const result = await authService.refreshToken({
      user_id,
      exp,
      refresh_token,
      role
    })
    return res.json({
      message: AUTH_MESSAGES.REFRESH_TOKEN_SUCCESS,
      result
    })
  },

  async sendVerifyEmail(req: Request, res: Response) {
    const { user_id, role } = req.decoded_authorization as TokenPayload
    const user = await userService.getUserById(user_id)

    if (!user) {
      return res.status(404).json({
        message: AUTH_MESSAGES.USER_NOT_FOUND
      })
    }

    if (user.is_email_verified === true) {
      return res.json({
        message: AUTH_MESSAGES.EMAIL_HAS_BEEN_VERIFIED
      })
    }

    const result = await authService.sendVerifyEmail(user_id, role)
    return res.json(result)
  },

  async verifyEmail(req: Request<ParamsDictionary, any, VerifyEmailReqBody>, res: Response) {
    const { user_id, role } = req.decoded_email_verify_token as TokenPayload
    const email_verify_token = req.body.email_verify_token
    const user = await userService.getUserById(user_id)

    // không tìm thấy user sẽ báo lỗi
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: AUTH_MESSAGES.USER_NOT_FOUND
      })
    }

    // email đã verify => không báo lỗi => trả về status 200 với message email đã verify
    if (user.is_email_verified === true) {
      return res.json({
        message: AUTH_MESSAGES.EMAIL_HAS_BEEN_VERIFIED
      })
    }

    if (email_verify_token !== user.email_verify_token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: AUTH_MESSAGES.TOKEN_IS_INVALID
      })
    }

    const result = await authService.verifyEmail(user_id, role)
    return res.json({
      message: AUTH_MESSAGES.VERIFY_EMAIL_SUCCESS,
      result
    })
  },

  async forgotPassword(req: Request<ParamsDictionary, any, ForgotPasswordReqBody>, res: Response) {
    const user = req.user as UserDocument
    const result = await authService.forgotPassword(user)
    return res.json(result)
  },

  async resetPassword(req: Request<ParamsDictionary, any, ResetPasswordReqBody>, res: Response) {
    const { user_id } = req.decoded_reset_password_token as TokenPayload
    const { password, reset_password_token } = req.body
    const user = await userService.getUserById(user_id)

    if (!user) {
      throw new ApiError({
        message: AUTH_MESSAGES.USER_NOT_FOUND,
        status: StatusCodes.NOT_FOUND
      })
    }

    if (user.reset_password_token !== reset_password_token) {
      throw new ApiError({
        message: AUTH_MESSAGES.RESET_PASSWORD_TOKEN_IS_INVALID,
        status: StatusCodes.UNAUTHORIZED
      })
    }

    const result = await authService.resetPassword(user_id, password)
    return res.json(result)
  }
}

export default authController
