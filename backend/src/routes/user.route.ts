import { Router } from 'express'
import { Roles } from '~/constants/enums'
import userController from '~/controllers/user.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import { validateIdParams, validatePaginationQuery } from '~/middlewares/common.middleware'
import userMiddleware from '~/middlewares/user.middleware'
import catchAsync from '~/utils/catchAsync'

const userRoute = Router()

/* middleware access token */
userRoute.use(authMiddleware.verifyAccessToken)

userRoute.get('/me', catchAsync(userController.getMe))
userRoute.get('/:user_id', validateIdParams(['user_id']), catchAsync(userController.getUser))
userRoute.put('/me', userMiddleware.updateMe, catchAsync(userController.updateMe))

/* middleware verify user status */
userRoute.use(authMiddleware.verifyUserStatus)

userRoute.put(
  '/change-password',
  userMiddleware.changePassword,
  catchAsync(userController.changePassword)
)

userRoute.post('/upload-image', catchAsync(userController.uploadImage))

userRoute.get('/', validatePaginationQuery, catchAsync(userController.getUsers))
userRoute.put(
  '/:user_id',
  validateIdParams(['user_id']),
  userMiddleware.updateUser,
  catchAsync(userController.updateUser)
)
userRoute.delete('/:user_id', validateIdParams(['user_id']), catchAsync(userController.deleteUser))

export default userRoute
