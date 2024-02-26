import { checkSchema } from 'express-validator'
import { CATEGORY_MESSAGES, USER_MESSAGES } from '~/constants/messages'
import validate from './validate'
import { regexUrl } from '~/constants/regex'

const categoryMiddleware = {
  createCategory: validate(
    checkSchema(
      {
        name: {
          trim: true,
          notEmpty: {
            errorMessage: CATEGORY_MESSAGES.CATEGORY_NAME_IS_REQUIRED
          },
          isString: {
            errorMessage: CATEGORY_MESSAGES.CATEGORY_NAME_MUST_BE_A_STRING
          }
        },
        image: {
          notEmpty: {
            errorMessage: CATEGORY_MESSAGES.IMAGE_IS_REQUIRED
          },
          isURL: {
            errorMessage: USER_MESSAGES.URL_IS_INVALID
          }
        }
      },
      ['body']
    )
  ),
  updateCategory: validate(
    checkSchema(
      {
        name: {
          trim: true,
          notEmpty: {
            errorMessage: CATEGORY_MESSAGES.CATEGORY_NAME_IS_REQUIRED
          },
          isString: {
            errorMessage: CATEGORY_MESSAGES.CATEGORY_NAME_MUST_BE_A_STRING
          }
        },
        image: {
          notEmpty: {
            errorMessage: CATEGORY_MESSAGES.IMAGE_IS_REQUIRED
          },
          isString: {
            errorMessage: CATEGORY_MESSAGES.IMAGE_URL_MUST_BE_A_STRING
          },
          custom: {
            options: (value) => {
              if (!regexUrl.test(value)) {
                throw new Error(USER_MESSAGES.URL_IS_INVALID)
              }
              return true
            }
          }
        }
      },
      ['body']
    )
  )
}

export default categoryMiddleware
