import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import db from '~/config/database'
import { NOTIFICATION_MESSAGES } from '~/constants/messages'
import Notification from '~/models/Notification'
import { CreateNotificationRequestBody } from '~/types/notification'
import { ApiError } from '~/utils/ApiError'
import isEqual from 'lodash/isEqual'
import { NotificationDocument } from '~/types/document'

const notificationService = {
  async createNotification(user_id: string, body: CreateNotificationRequestBody) {
    const { title, content, image } = body
    const result = await db.notifications.insertOne(
      new Notification({ title, content, image, created_by: new ObjectId(user_id) })
    )
    const notification = await db.notifications.findOne({ _id: result.insertedId })
    return notification
  },
  async deleteNotificationById(notification_id: string) {
    const result = await db.notifications.findOneAndDelete({ _id: new ObjectId(notification_id) })
    return result
  },
  async getNotifications(user_id: string) {
    const notifications = await db.notifications
      .aggregate<NotificationDocument>([
        {
          $lookup: {
            from: 'users',
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by'
          }
        },
        {
          $unwind: {
            path: '$created_by'
          }
        },
        {
          $project: {
            created_by: {
              password: 0,
              email_verify_token: 0,
              reset_password_token: 0,
              is_email_verified: 0,
              email: 0,
              date_of_birth: 0,
              address: 0,
              created_at: 0,
              updated_at: 0,
              role_id: 0,
              phone: 0
            }
          }
        }
      ])
      .sort({ created_at: -1 })
      .toArray()
    const result = notifications.map((notification) => {
      const userIds = notification.read.map((userId) => userId.toString())
      return {
        ...notification,
        read: userIds.includes(user_id)
      }
    })

    return result
  },
  async markNotificationAsRead(user_id: string, notification_id: string) {
    const notification = await db.notifications.findOne({ _id: new ObjectId(notification_id) })
    if (!notification) {
      throw new ApiError({
        status: StatusCodes.NOT_FOUND,
        message: NOTIFICATION_MESSAGES.NOTIFICATION_NOT_FOUND
      })
    }
    const userIds = notification.read.map((userId) => userId.toString())
    if (!userIds.includes(user_id)) {
      await db.notifications.updateOne(
        { _id: new ObjectId(notification_id) },
        { $push: { read: new ObjectId(user_id) } }
      )
    }
  },
  async markAllNotificationAsRead(user_id: string) {
    const notifications = await db.notifications.find().toArray()

    await Promise.all(
      notifications.map(async (notification) => {
        const userIds = notification.read.map((userId) => userId.toString())
        if (!userIds.includes(user_id)) {
          return await db.notifications.updateOne(
            { _id: notification._id },
            { $push: { read: new ObjectId(user_id) } }
          )
        }
      })
    )
  }
}

export default notificationService
