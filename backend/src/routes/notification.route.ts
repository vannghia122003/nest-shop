import { Router } from 'express'
import notificationController from '~/controllers/notification.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import { validateIdParams } from '~/middlewares/common.middleware'
import notificationMiddleware from '~/middlewares/notification.middleware'
import catchAsync from '~/utils/catchAsync'

const notificationRoute = Router()

notificationRoute.use(authMiddleware.verifyAccessToken)

notificationRoute.get('/', catchAsync(notificationController.getNotifications))

notificationRoute.use(authMiddleware.verifyUserStatus)

notificationRoute.post(
  '/',
  notificationMiddleware.createNotification,
  catchAsync(notificationController.createNotification)
)
notificationRoute.delete(
  '/:notification_id',
  validateIdParams(['notification_id']),
  catchAsync(notificationController.deleteNotification)
)
notificationRoute.put(
  '/:notification_id/mark-as-read',
  validateIdParams(['notification_id']),
  catchAsync(notificationController.markNotification)
)
notificationRoute.put('/mark-all-read', catchAsync(notificationController.markAllNotification))

export default notificationRoute
