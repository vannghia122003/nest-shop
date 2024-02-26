import { Router } from 'express'
import roleController from '~/controllers/role.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import { validateIdParams } from '~/middlewares/common.middleware'
import roleMiddleware from '~/middlewares/role.middleware'
import catchAsync from '~/utils/catchAsync'

const roleRoute = Router()

roleRoute.use(authMiddleware.verifyAccessToken)
roleRoute.use(authMiddleware.verifyUserStatus)

roleRoute.get('/', catchAsync(roleController.getRoles))
roleRoute.post('/', roleMiddleware.createRole, catchAsync(roleController.createRole))
roleRoute.get('/:role_id', validateIdParams(['role_id']), catchAsync(roleController.getRole))
roleRoute.delete('/:role_id', validateIdParams(['role_id']), catchAsync(roleController.deleteRole))
roleRoute.put(
  '/:role_id',
  validateIdParams(['role_id']),
  roleMiddleware.updateRole,
  catchAsync(roleController.updateRoles)
)

export default roleRoute
