import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { StatusCodes } from 'http-status-codes'
import { NOTIFICATION_MESSAGES } from '~/constants/messages'
import notificationService from '~/services/notification.service'
import { CreateNotificationRequestBody, NotificationIdReqParams } from '~/types/notification'
import { TokenPayload } from '~/utils/jwt'

const notificationController = {
  async getNotifications(req: Request, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await notificationService.getNotifications(user_id)
    res.json({
      message: NOTIFICATION_MESSAGES.GET_NOTIFICATIONS_SUCCESS,
      result
    })
  },
  async createNotification(
    req: Request<ParamsDictionary, any, CreateNotificationRequestBody>,
    res: Response
  ) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await notificationService.createNotification(user_id, req.body)
    res.status(StatusCodes.CREATED).json({
      message: NOTIFICATION_MESSAGES.CREATE_NOTIFICATION_SUCCESS,
      result
    })
  },
  async deleteNotification(req: Request<NotificationIdReqParams>, res: Response) {
    const result = await notificationService.deleteNotificationById(req.params.notification_id)
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: NOTIFICATION_MESSAGES.NOTIFICATION_NOT_FOUND
      })
    }
    res.status(StatusCodes.NO_CONTENT).send()
  },
  async markNotification(req: Request<NotificationIdReqParams>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    await notificationService.markNotificationAsRead(user_id, req.params.notification_id)
    res.json({
      message: NOTIFICATION_MESSAGES.NOTIFICATION_MARKED_AS_READ
    })
  },
  async markAllNotification(req: Request<NotificationIdReqParams>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    await notificationService.markAllNotificationAsRead(user_id)
    res.json({
      message: NOTIFICATION_MESSAGES.NOTIFICATION_MARKED_AS_READ
    })
  }
}

export default notificationController
