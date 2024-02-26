export interface Notification {
  _id: string
  title: string
  content: string
  image: string
  read: boolean
  created_by: {
    _id: string
    name: string
    avatar: string
  }
  created_at: string
}

export interface NotificationBody {
  title: string
  content: string
  image: string
}
