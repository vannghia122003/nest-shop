import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import db from '~/config/database'
import env from '~/config/environment'
import { RolesId, TokenType } from '~/constants/enums'
import { AUTH_MESSAGES } from '~/constants/messages'
import RefreshToken from '~/models/RefreshToken'
import User from '~/models/User'
import { UserDocument } from '~/types/document'
import { LoginReqBody, RegisterReqBody } from '~/types/auth'
import { ApiError } from '~/utils/ApiError'
import { comparePassword, hashPassword } from '~/utils/bcrypt'
import { generateToken, verifyToken } from '~/utils/jwt'
import emailService from './email.service'
import userService from './user.service'
import Cart from '~/models/Cart'

const authService = {
  async register(payload: RegisterReqBody) {
    const user = await db.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password),
        role_id: new ObjectId(RolesId.User)
      })
    )
    await db.carts.insertOne(new Cart({ user_id: user.insertedId }))
    return {
      message: AUTH_MESSAGES.REGISTER_SUCCESS
    }
  },

  async login(payload: LoginReqBody) {
    const { email, password } = payload
    const user = await userService.getUserByEmail(email)
    if (user && comparePassword(password, user.password)) {
      const [access_token, refresh_token] = await Promise.all([
        generateToken(
          {
            user_id: user._id,
            token_type: TokenType.AccessToken,
            role: user.role
          },
          env.SECRET_KEY_ACCESS_TOKEN,
          env.ACCESS_TOKEN_EXPIRES_IN
        ),
        generateToken(
          {
            user_id: user._id,
            token_type: TokenType.RefreshToken,
            role: user.role
          },
          env.SECRET_KEY_REFRESH_TOKEN,
          env.REFRESH_TOKEN_EXPIRES_IN
        )
      ])
      const { exp } = await verifyToken(refresh_token, env.SECRET_KEY_REFRESH_TOKEN)
      await db.refreshTokens.insertOne(
        new RefreshToken({ token: refresh_token, user_id: user._id, exp })
      )
      return {
        access_token,
        refresh_token
      }
    }

    throw new ApiError({
      status: StatusCodes.UNAUTHORIZED,
      message: AUTH_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT
    })
  },

  async logout(refresh_token: string) {
    await db.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: AUTH_MESSAGES.LOGOUT_SUCCESS
    }
  },

  async refreshToken({
    user_id,
    exp,
    refresh_token,
    role
  }: {
    user_id: string
    exp: number
    refresh_token: string
    role: {
      _id: string
      name: string
    }
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      generateToken(
        {
          user_id,
          token_type: TokenType.AccessToken,
          role
        },
        env.SECRET_KEY_ACCESS_TOKEN,
        env.ACCESS_TOKEN_EXPIRES_IN
      ),
      generateToken(
        {
          user_id,
          token_type: TokenType.RefreshToken,
          role,
          exp
        },
        env.SECRET_KEY_REFRESH_TOKEN
      ),
      db.refreshTokens.deleteOne({ token: refresh_token })
    ])
    await db.refreshTokens.insertOne(
      new RefreshToken({ token: new_refresh_token, user_id: new ObjectId(user_id), exp })
    )

    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  },

  async sendVerifyEmail(
    user_id: string,
    role: {
      _id: string
      name: string
    }
  ) {
    const email_verify_token = await generateToken(
      { user_id, token_type: TokenType.VerifyEmailToken, role },
      env.SECRET_KEY_EMAIL_VERIFY_TOKEN,
      env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
    )

    const user = await db.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          email_verify_token
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )

    /* Gửi email */
    // console.log(`http://localhost:3000/verify-email?token=${email_verify_token}`)

    await emailService.sendVerificationEmail(user as User)

    return {
      message: AUTH_MESSAGES.SEND_EMAIL_VERIFY_SUCCESS
    }
  },

  async verifyEmail(
    user_id: string,
    role: {
      _id: string
      name: string
    }
  ) {
    const [access_token, refresh_token] = await Promise.all([
      generateToken(
        { user_id: user_id, token_type: TokenType.AccessToken, role },
        env.SECRET_KEY_ACCESS_TOKEN,
        env.ACCESS_TOKEN_EXPIRES_IN
      ),
      generateToken(
        { user_id: user_id, token_type: TokenType.RefreshToken, role },
        env.SECRET_KEY_REFRESH_TOKEN,
        env.REFRESH_TOKEN_EXPIRES_IN
      ),
      db.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            email_verify_token: '',
            is_email_verified: true
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    ])
    const { exp } = await verifyToken(refresh_token, env.SECRET_KEY_REFRESH_TOKEN)
    // thêm refresh token vào collection
    await db.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, exp })
    )

    return {
      access_token,
      refresh_token
    }
  },

  async forgotPassword(userDocument: UserDocument) {
    const { _id } = userDocument
    const reset_password_token = await generateToken(
      {
        user_id: _id,
        token_type: TokenType.ResetPasswordToken,
        role: userDocument.role
      },
      env.SECRET_KEY_RESET_PASSWORD_TOKEN,
      env.RESET_PASSWORD_TOKEN_EXPIRES_IN
    )

    const user = await db.users.findOneAndUpdate(
      { _id },
      {
        $set: {
          reset_password_token
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )

    /* Gửi email kèm link reset password đến user https://url_client.com/forgot-password?token=token */
    // console.log(`http://localhost:3000/reset-password?token=${reset_password_token}`)
    await emailService.sendResetPasswordEmail(user as User)

    return {
      message: AUTH_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  },

  async resetPassword(user_id: string, password: string) {
    await db.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(password),
          reset_password_token: ''
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    return {
      message: AUTH_MESSAGES.RESET_PASSWORD_SUCCESS
    }
  }
}

export default authService
