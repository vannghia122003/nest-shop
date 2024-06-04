import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import db from '~/config/database'
import env from '~/config/environment'
import { RolesId } from '~/constants/enums'
import { AUTH_MESSAGES, ROLE_MESSAGE } from '~/constants/messages'
import roleService from '~/services/role.service'
import { ApiError } from '~/utils/ApiError'
import { verifyToken } from '~/utils/jwt'
import validate from './validate'

const roleMiddleware = {
  updateRole: validate(
    checkSchema(
      {
        name: {
          trim: true,
          notEmpty: {
            errorMessage: ROLE_MESSAGE.ROLE_NAME_IS_REQUIRED
          },
          isString: {
            errorMessage: ROLE_MESSAGE.ROLE_NAME_MUST_BE_A_STRING
          }
        },
        permissions: {
          isArray: {
            errorMessage: ROLE_MESSAGE.PERMISSIONS_MUST_BE_A_ARRAY
          },
          custom: {
            options: (value: string[]) => {
              const permissions = value
              if (permissions.length === 0) {
                return true
              }
              permissions.forEach((id) => {
                if (!ObjectId.isValid(id)) {
                  throw new Error(ROLE_MESSAGE.PERMISSIONS_MUST_BE_A_ARRAY)
                }
              })
              return true
            }
          }
        }
      },
      ['body']
    )
  ),
  createRole: validate(
    checkSchema(
      {
        name: {
          notEmpty: {
            errorMessage: ROLE_MESSAGE.ROLE_NAME_IS_REQUIRED
          },
          custom: {
            options: async (value: string) => {
              const role = await db.roles.findOne({ name: value.toLowerCase() })
              if (role) {
                throw new Error(ROLE_MESSAGE.ROLE_ALREADY_EXISTS)
              }
              return true
            }
          }
        }
      },
      ['body']
    )
  ),
  async checkPermission(req: Request, res: Response, next: NextFunction) {
    const { path, headers, method } = req
    const nonSecurePaths = ['/auth', '/users/me', '/users/change-password', '/users/upload-image']
    if (!headers.authorization || nonSecurePaths.some((item) => path.includes(item))) return next()
    const access_token = headers.authorization.split(' ')
    if (access_token) {
      if (access_token[0] !== 'Bearer') {
        return next(
          new ApiError({
            message: AUTH_MESSAGES.ACCESS_TOKEN_IS_INVALID,
            status: StatusCodes.UNAUTHORIZED
          })
        )
      }
      try {
        const { role } = await verifyToken(access_token[1], env.SECRET_KEY_ACCESS_TOKEN)
        if (role._id === RolesId.SuperAdmin) return next() // nếu super admin thì next
        const permissions = (await roleService.getRoleById(role._id)).permissions
        const currentPath = path
          .split('/')
          .map((item) => {
            if (ObjectId.isValid(item)) return ':id'
            return item
          })
          .join('/')
        if (
          permissions.some(
            (permission) => permission.method === method && permission.resource === currentPath
          )
        ) {
          return next()
        } else {
          return next(
            new ApiError({
              status: StatusCodes.FORBIDDEN,
              message: AUTH_MESSAGES.ACCESS_DENIED
            })
          )
        }
      } catch (error) {
        return next(
          new ApiError({
            message: (error as JsonWebTokenError).message,
            status: StatusCodes.UNAUTHORIZED
          })
        )
      }
    }
  }
}

export default roleMiddleware
