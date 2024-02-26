import { Router } from 'express'
import permissionController from '~/controllers/permission.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import catchAsync from '~/utils/catchAsync'

const permissionRoute = Router()

permissionRoute.use(authMiddleware.verifyAccessToken)
permissionRoute.use(authMiddleware.verifyUserStatus)

permissionRoute.get('/', catchAsync(permissionController.getPermissions))

permissionRoute.post('/', catchAsync(permissionController.createPermission))

export default permissionRoute
