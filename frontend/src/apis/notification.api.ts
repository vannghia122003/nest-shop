import { SuccessResponse } from '~/types/response.type'
import http from './http'
import { NotificationBody, Notification } from '~/types/notification.type'

const notificationApi = {
  createNotification(data: NotificationBody) {
    return http.post<undefined, SuccessResponse<undefined>>('/notifications', data)
  },
  getNotifications() {
    return http.get<undefined, SuccessResponse<Notification[]>>('/notifications')
  },
  deleteNotification(notificationId: string) {
    return http.delete(`/notifications/${notificationId}`)
  },
  markAsRead(notificationId: string) {
    return http.put<undefined, SuccessResponse<Notification>>(
      `/notifications/${notificationId}/mark-as-read`
    )
  },
  markAllRead() {
    return http.put<undefined, SuccessResponse<Notification>>(`/notifications/mark-all-read`)
  }
}

export default notificationApi
