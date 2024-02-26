import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { AUTH_MESSAGES, ROLE_MESSAGE } from '~/constants/messages'
import roleService from '~/services/role.service'
import { CreateRoleReqBody, RoleIdReqParams, UpdateRoleReqBody } from '~/types/role'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/utils/jwt'
import db from '~/config/database'
import { ObjectId } from 'mongodb'
import { RolesId } from '~/constants/enums'

const roleController = {
  async getRoles(req: Request, res: Response) {
    const result = await roleService.getRoles()
    res.json({
      message: ROLE_MESSAGE.GET_ROLES_SUCCESS,
      result
    })
  },

  async createRole(req: Request<ParamsDictionary, any, CreateRoleReqBody>, res: Response) {
    const result = await roleService.checkAndCreateRole(req.body.name)
    res.json({
      message: ROLE_MESSAGE.CREATE_ROLE_SUCCESS,
      result
    })
  },

  async getRole(req: Request<RoleIdReqParams>, res: Response) {
    const result = await roleService.getRoleById(req.params.role_id)
    res.json({
      message: ROLE_MESSAGE.GET_ROLE_SUCCESS,
      result
    })
  },

  async updateRoles(req: Request<RoleIdReqParams, any, UpdateRoleReqBody>, res: Response) {
    const { role } = req.decoded_authorization as TokenPayload
    //nếu role cần update là user thì chỉ có super admin mới đc update
    if (req.params.role_id === RolesId.User && !(role._id === RolesId.SuperAdmin)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: AUTH_MESSAGES.ACCESS_DENIED
      })
    }

    const result = await roleService.updateRole(req.params.role_id, req.body)
    if (result === null) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: ROLE_MESSAGE.ROLE_NOT_FOUND })
    }
    res.json({
      message: ROLE_MESSAGE.UPDATE_ROLE_SUCCESS,
      result
    })
  },
  async deleteRole(req: Request<RoleIdReqParams>, res: Response) {
    const result = await roleService.deleteRole(req.params.role_id)
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ROLE_MESSAGE.ROLE_NOT_FOUND
      })
    }
    res.status(StatusCodes.NO_CONTENT).send()
  }
}

export default roleController
