import { checkSchema } from 'express-validator'
import validate from './validate'
import { ORDER_MESSAGES } from '~/constants/messages'
import { OrderStatus } from '~/constants/enums'

const orderMiddleware = {
  updateOrder: validate(
    checkSchema(
      {
        status: {
          notEmpty: {
            errorMessage: ORDER_MESSAGES.STATUS_IS_REQUIRED
          },
          isIn: {
            options: [
              [
                OrderStatus.Processing,
                OrderStatus.Shipping,
                OrderStatus.Completed,
                OrderStatus.Cancelled
              ]
            ],
            errorMessage: ORDER_MESSAGES.STATUS_IS_INVALID
          }
        }
      },
      ['body']
    )
  )
}

export default orderMiddleware
