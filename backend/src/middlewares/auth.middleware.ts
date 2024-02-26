import { checkSchema } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { JsonWebTokenError } from 'jsonwebtoken'
import db from '~/config/database'
import { AUTH_MESSAGES } from '~/constants/messages'
import { ApiError } from '~/utils/ApiError'
import { TokenPayload, verifyToken } from '~/utils/jwt'
import { Request, Response, NextFunction } from 'express'
import validate from './validate'
import userService from '~/services/user.service'
import env from '~/config/environment'

const authMiddleware = {
  register: validate(
    checkSchema(
      {
        name: {
          trim: true,
          notEmpty: {
            errorMessage: AUTH_MESSAGES.NAME_IS_REQUIRED
          },
          isString: {
            errorMessage: AUTH_MESSAGES.NAME_MUST_BE_A_STRING
          },
          isLength: {
            options: {
              min: 2
            },
            errorMessage: AUTH_MESSAGES.NAME_AT_LEAST_2_CHARACTERS
          }
        },
        email: {
          trim: true,
          notEmpty: {
            errorMessage: AUTH_MESSAGES.EMAIL_IS_REQUIRED
          },
          isEmail: {
            errorMessage: AUTH_MESSAGES.EMAIL_IS_INVALID
          },
          custom: {
            options: async (value) => {
              const user = await userService.getUserByEmail(value)

              if (user) {
                throw new Error(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS)
              }
              return true
            }
          }
        },
        address: {
          trim: true,
          notEmpty: {
            errorMessage: AUTH_MESSAGES.ADDRESS_IS_REQUIRED
          }
        },
        password: {
          notEmpty: {
            errorMessage: AUTH_MESSAGES.PASSWORD_IS_REQUIRED
          },
          isLength: {
            options: {
              min: 6
            },
            errorMessage: AUTH_MESSAGES.PASSWORD_AT_LEAST_6_CHARACTERS
          }
        },
        confirm_password: {
          notEmpty: {
            errorMessage: AUTH_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
          },
          custom: {
            options: async (value, { req }) => {
              if (value !== req.body.password) {
                throw new Error(AUTH_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH)
              }
              return true
            }
          }
        },
        date_of_birth: {
          optional: true,
          isISO8601: {
            options: {
              strict: true,
              strictSeparator: true
            },
            errorMessage: AUTH_MESSAGES.INVALID_DATE_OF_BIRTH
          },
          custom: {
            options: (value) => {
              const currentDate = new Date()
              if (new Date(value) > currentDate) {
                throw new Error(AUTH_MESSAGES.INVALID_DATE_OF_BIRTH)
              }
              return true
            }
          }
        }
      },
      ['body']
    )
  ),
  login: validate(
    checkSchema({
      email: {
        trim: true,
        notEmpty: {
          errorMessage: AUTH_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: AUTH_MESSAGES.EMAIL_IS_INVALID
        }
      },
      password: {
        notEmpty: {
          errorMessage: AUTH_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isLength: {
          options: {
            min: 6
          },
          errorMessage: AUTH_MESSAGES.PASSWORD_AT_LEAST_6_CHARACTERS
        },
        trim: true
      }
    })
  ),
  verifyAccessToken: validate(
    checkSchema(
      {
        Authorization: {
          custom: {
            options: async (value: string, { req }) => {
              if (!value) {
                throw new ApiError({
                  message: AUTH_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                  status: StatusCodes.UNAUTHORIZED
                })
              }
              const access_token = value.split(' ')
              if (access_token[0] !== 'Bearer') {
                throw new ApiError({
                  message: AUTH_MESSAGES.ACCESS_TOKEN_IS_INVALID,
                  status: StatusCodes.UNAUTHORIZED
                })
              }

              try {
                const decoded_authorization = await verifyToken(
                  access_token[1],
                  env.SECRET_KEY_ACCESS_TOKEN
                )
                ;(req as Request).decoded_authorization = decoded_authorization
              } catch (error) {
                throw new ApiError({
                  message: (error as JsonWebTokenError).message,
                  status: StatusCodes.UNAUTHORIZED
                })
              }

              return true
            }
          }
        }
      },
      ['headers']
    )
  ),
  verifyRefreshToken: validate(
    checkSchema(
      {
        refresh_token: {
          custom: {
            options: async (value: string, { req }) => {
              if (!value) {
                throw new ApiError({
                  message: AUTH_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                  status: StatusCodes.UNAUTHORIZED
                })
              }

              try {
                const [decoded_refresh_token, refresh_token] = await Promise.all([
                  verifyToken(value, process.env.SECRET_KEY_REFRESH_TOKEN as string),
                  db.refreshTokens.findOne({ token: value })
                ])

                if (refresh_token === null) {
                  throw new ApiError({
                    message: AUTH_MESSAGES.REFRESH_TOKEN_DOES_NOT_EXIST,
                    status: StatusCodes.UNAUTHORIZED
                  })
                }

                ;(req as Request).decoded_refresh_token = decoded_refresh_token
              } catch (error) {
                throw new ApiError({
                  message: (error as JsonWebTokenError).message,
                  status: StatusCodes.UNAUTHORIZED
                })
              }

              return true
            }
          }
        }
      },
      ['body']
    )
  ),
  verifyEmailToken: validate(
    checkSchema(
      {
        email_verify_token: {
          trim: true,
          custom: {
            options: async (value: string, { req }) => {
              if (!value) {
                throw new ApiError({
                  message: AUTH_MESSAGES.TOKEN_IS_REQUIRED,
                  status: StatusCodes.UNAUTHORIZED
                })
              }

              try {
                const decoded_email_verify_token = await verifyToken(
                  value,
                  env.SECRET_KEY_EMAIL_VERIFY_TOKEN
                )

                ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
              } catch (error) {
                throw new ApiError({
                  message: (error as JsonWebTokenError).message,
                  status: StatusCodes.UNAUTHORIZED
                })
              }

              return true
            }
          }
        }
      },
      ['body']
    )
  ),
  forgotPassword: validate(
    checkSchema(
      {
        email: {
          isEmail: {
            errorMessage: AUTH_MESSAGES.EMAIL_IS_INVALID
          },
          trim: true,
          custom: {
            options: async (value, { req }) => {
              const user = await userService.getUserByEmail(value)

              if (!user) {
                throw new Error(AUTH_MESSAGES.EMAIL_DOES_NOT_EXIST)
              }

              req.user = user
              return true
            }
          }
        }
      },
      ['body']
    )
  ),
  resetPassword: validate(
    checkSchema(
      {
        password: {
          notEmpty: {
            errorMessage: AUTH_MESSAGES.PASSWORD_IS_REQUIRED
          },
          isLength: {
            options: {
              min: 6
            },
            errorMessage: AUTH_MESSAGES.PASSWORD_AT_LEAST_6_CHARACTERS
          }
        },
        confirm_password: {
          notEmpty: {
            errorMessage: AUTH_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
          },
          custom: {
            options: async (value, { req }) => {
              if (value !== req.body.password) {
                throw new Error(AUTH_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH)
              }
              return true
            }
          }
        },
        reset_password_token: {
          trim: true,
          custom: {
            options: async (value: string, { req }) => {
              if (!value) {
                throw new ApiError({
                  message: AUTH_MESSAGES.RESET_PASSWORD_TOKEN_IS_REQUIRED,
                  status: StatusCodes.UNAUTHORIZED
                })
              }

              try {
                const decoded_reset_password_token = await verifyToken(
                  value,
                  env.SECRET_KEY_RESET_PASSWORD_TOKEN
                )

                ;(req as Request).decoded_reset_password_token = decoded_reset_password_token
              } catch (error) {
                throw new ApiError({
                  message: (error as JsonWebTokenError).message,
                  status: StatusCodes.UNAUTHORIZED
                })
              }

              return true
            }
          }
        }
      },
      ['body']
    )
  ),
  async verifyUserStatus(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const user = await userService.getUserById(user_id)
    if (!user) {
      return next(
        new ApiError({
          status: StatusCodes.NOT_FOUND,
          message: AUTH_MESSAGES.USER_NOT_FOUND
        })
      )
    }
    if (!user.is_email_verified) {
      return next(
        new ApiError({
          status: StatusCodes.FORBIDDEN,
          message: AUTH_MESSAGES.USER_NOT_VERIFIED
        })
      )
    }
    next()
  }
  // verifyRole(roles: Roles[]) {
  //   return async (req: Request, res: Response, next: NextFunction) => {
  //     const { role } = req.decoded_authorization as TokenPayload
  //     if (!roles.includes(role.name)) {
  //       return next(
  //         new ApiError({
  //           status: StatusCodes.FORBIDDEN,
  //           message: AUTH_MESSAGES.NOT_HAVE_ACCESS
  //         })
  //       )
  //     }
  //     next()
  //   }
  // }
}

export default authMiddleware
