import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { AUTH_MESSAGES, USER_MESSAGES } from '~/constants/messages'
import { regexPhoneNumber, regexUrl } from '~/constants/regex'
import validate from '~/middlewares/validate'
import roleService from '~/services/role.service'
import userService from '~/services/user.service'
import { ApiError } from '~/utils/ApiError'
import { comparePassword } from '~/utils/bcrypt'
import { TokenPayload } from '~/utils/jwt'

const userMiddleware = {
  updateMe: validate(
    checkSchema(
      {
        name: {
          trim: true,
          optional: true,
          isString: {
            errorMessage: USER_MESSAGES.NAME_MUST_BE_A_STRING
          },
          isLength: {
            options: {
              min: 1,
              max: 100
            },
            errorMessage: USER_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
          }
        },
        avatar: {
          trim: true,
          optional: true,
          isURL: {
            errorMessage: USER_MESSAGES.URL_IS_INVALID
          }
        },
        phone: {
          trim: true,
          optional: true,
          custom: {
            options: (value) => {
              if (!regexPhoneNumber.test(value)) {
                throw new Error(USER_MESSAGES.PHONE_NUMBER_IS_INVALID)
              }
              return true
            }
          }
        },
        address: {
          trim: true,
          optional: true,
          notEmpty: {
            errorMessage: AUTH_MESSAGES.ADDRESS_IS_REQUIRED
          }
        },
        date_of_birth: {
          optional: true,
          notEmpty: {
            errorMessage: AUTH_MESSAGES.DATE_OF_BIRTH_IS_REQUIRED
          },
          isISO8601: {
            options: {
              strict: true,
              strictSeparator: true
            },
            errorMessage: AUTH_MESSAGES.PLEASE_USE_ISO_STRING_FORMAT
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
  changePassword: validate(
    checkSchema(
      {
        old_password: {
          notEmpty: {
            errorMessage: AUTH_MESSAGES.PASSWORD_IS_REQUIRED
          },
          isLength: {
            options: {
              min: 6
            },
            errorMessage: AUTH_MESSAGES.PASSWORD_AT_LEAST_6_CHARACTERS
          },
          custom: {
            options: async (value, { req }) => {
              const { user_id } = (req as Request).decoded_authorization as TokenPayload
              const user = await userService.getUserById(user_id)
              if (!user) {
                throw new ApiError({
                  message: AUTH_MESSAGES.USER_NOT_FOUND,
                  status: StatusCodes.NOT_FOUND
                })
              }

              if (!comparePassword(value, user.password)) {
                throw new Error(USER_MESSAGES.OLD_PASSWORD_NOT_MATCH)
              }
              return true
            }
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
        }
      },
      ['body']
    )
  ),
  updateUser: validate(
    checkSchema(
      {
        name: {
          optional: true,
          isString: {
            errorMessage: USER_MESSAGES.NAME_MUST_BE_A_STRING
          },
          isLength: {
            options: {
              min: 1,
              max: 100
            },
            errorMessage: USER_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
          }
        },
        avatar: {
          trim: true,
          optional: true,
          isURL: {
            errorMessage: USER_MESSAGES.URL_IS_INVALID
          },
          custom: {
            options: (value) => {
              if (!regexUrl.test(value)) {
                throw new Error(USER_MESSAGES.URL_IS_INVALID)
              }
              return true
            }
          }
        },
        phone: {
          trim: true,
          optional: true,
          custom: {
            options: (value) => {
              if (!regexPhoneNumber.test(value)) {
                throw new Error(USER_MESSAGES.PHONE_NUMBER_IS_INVALID)
              }
              return true
            }
          }
        },
        address: {
          trim: true,
          optional: true,
          notEmpty: {
            errorMessage: AUTH_MESSAGES.ADDRESS_IS_REQUIRED
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
        },
        role_id: {
          optional: true,
          custom: {
            options: async (value) => {
              const roles = await roleService.getRoles()
              const roleIds = roles.map((role) => role._id.toString())
              if (!ObjectId.isValid(value) || !roleIds.includes(value)) {
                throw new Error('Role không hợp lệ')
              }
              return true
            }
          }
        }
      },
      ['body']
    )
  )
}

export default userMiddleware
