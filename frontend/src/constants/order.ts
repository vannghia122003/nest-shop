/* export enum OrderStatus {
  Processing,
  Shipping,
  Completed,
  Cancelled
} */

export const orderStatus = {
  all: -1,
  processing: 0,
  shipping: 1,
  completed: 2,
  cancelled: 3
} as const
