export interface ServerToClientEvents {
  add_review: () => void
  update_review: () => void
  delete_review: () => void
  typing_review: () => void
  review_empty: () => void

  receive_notifications: () => void
  verify_email_success: () => void
}

export interface ClientToServerEvents {
  join_product_room: (product_id: string) => void
  add_review: () => void
  update_review: () => void
  delete_review: () => void
  typing_review: () => void
  review_empty: () => void

  send_notification: () => void
  join_user_room: (user_id: string) => void
  user_verify_email_success: () => void
}
