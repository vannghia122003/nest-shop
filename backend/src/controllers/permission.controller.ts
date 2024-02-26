import { Request, Response } from 'express'
import permissionService from '~/services/permission.service'
import { CreatePermissionReqBody } from '~/types/permission'

const permissionController = {
  async createPermission(req: Request<any, any, any, CreatePermissionReqBody>, res: Response) {
    const result = await permissionService.createPermission(req.body)
    res.json(result)
  },
  async getPermissions(req: Request<any, any, any, CreatePermissionReqBody>, res: Response) {
    const result = await permissionService.getPermissions()
    res.json({ message: 'Get permissions successfully', result })
  }
}

export default permissionController
