import { checkSchema } from 'express-validator'
import validate from './validate'
import { NOTIFICATION_MESSAGES } from '~/constants/messages'

const notificationMiddleware = {
  createNotification: validate(
    checkSchema(
      {
        title: {
          notEmpty: {
            errorMessage: NOTIFICATION_MESSAGES.TITLE_IS_REQUIRED
          }
        },
        content: {
          notEmpty: {
            errorMessage: NOTIFICATION_MESSAGES.CONTENT_IS_REQUIRED
          }
        },
        image: {
          notEmpty: {
            errorMessage: NOTIFICATION_MESSAGES.IMAGE_IS_REQUIRED
          },
          isURL: {
            errorMessage: NOTIFICATION_MESSAGES.URL_IS_INVALID
          }
        }
      },
      ['body']
    )
  )
}

export default notificationMiddleware
