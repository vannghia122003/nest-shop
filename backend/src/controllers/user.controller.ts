import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { StatusCodes } from 'http-status-codes'
import { omit } from 'lodash'
import { USER_MESSAGES } from '~/constants/messages'
import userService from '~/services/user.service'
import { PaginationReqQuery } from '~/types/common'
import {
  ChangePasswordReqBody,
  UpdateMeReqBody,
  UpdateUserReqBody,
  UserIdReqParams
} from '~/types/user'
import { TokenPayload } from '~/utils/jwt'

const userController = {
  async getMe(req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const user = await userService.getUserById(user_id)
    return res.json({
      message: USER_MESSAGES.GET_PROFILE_SUCCESS,
      result: omit(user, ['email_verify_token', 'forgot_password_token', 'password'])
    })
  },

  async updateMe(req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const body = req.body
    const result = await userService.updateMe(user_id, body)
    return res.json({
      message: USER_MESSAGES.UPDATE_USER_SUCCESS,
      result
    })
  },

  async changePassword(req: Request<ParamsDictionary, any, ChangePasswordReqBody>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { password } = req.body
    const result = await userService.changePassword(user_id, password)
    return res.json(result)
  },

  async getUsers(req: Request<ParamsDictionary, any, any, PaginationReqQuery>, res: Response) {
    const page = req.query.page ? Number(req.query.page) : 1
    const limit = req.query.limit ? Number(req.query.limit) : 10

    const { users, totalDocuments } = await userService.getUsers({ limit, page })
    res.json({
      message: USER_MESSAGES.GET_USERS_SUCCESS,
      result: users,
      page,
      total_pages: Math.ceil(totalDocuments / limit),
      total_results: totalDocuments
    })
  },

  async getUser(req: Request<UserIdReqParams>, res: Response) {
    const user = await userService.getUserById(req.params.user_id)
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: USER_MESSAGES.USER_NOT_FOUND
      })
    }

    res.json({
      message: USER_MESSAGES.GET_USER_SUCCESS,
      result: omit(user, ['email_verify_token', 'forgot_password_token', 'password'])
    })
  },

  async updateUser(req: Request<UserIdReqParams, any, UpdateUserReqBody>, res: Response) {
    const user = await userService.updateUserById(req.params.user_id, req.body)

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: USER_MESSAGES.USER_NOT_FOUND
      })
    }

    res.json({
      message: USER_MESSAGES.UPDATE_USER_SUCCESS,
      result: user
    })
  },

  async deleteUser(req: Request<UserIdReqParams>, res: Response) {
    const result = await userService.deleteUserById(req.params.user_id)
    if (result === null) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: USER_MESSAGES.USER_NOT_FOUND
      })
    }
    res.status(StatusCodes.NO_CONTENT).send()
  },

  async uploadImage(req: Request, res: Response) {
    const result = await userService.handleUploadImage(req)
    res.json({
      message: USER_MESSAGES.UPLOAD_IMAGE_SUCCESS,
      result
    })
  }
}

export default userController
