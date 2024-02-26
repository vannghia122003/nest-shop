import { body, checkSchema } from 'express-validator'
import { CART_MESSAGES, PRODUCT_MESSAGES } from '~/constants/messages'
import validate from './validate'
import db from '~/config/database'
import { ObjectId } from 'mongodb'

const cartMiddleware = {
  addToCart: validate(
    checkSchema(
      {
        product_id: {
          notEmpty: {
            errorMessage: PRODUCT_MESSAGES.PRODUCT_ID_IS_REQUIRED
          },
          custom: {
            options: async (product_id: string) => {
              const products = await db.products.find().toArray()
              const productIds = products.map((product) => product._id.toString())
              if (!ObjectId.isValid(product_id) || !productIds.includes(product_id)) {
                throw new Error(PRODUCT_MESSAGES.PRODUCT_ID_IS_INVALID)
              }
              return true
            }
          }
        },
        buy_count: {
          notEmpty: {
            errorMessage: PRODUCT_MESSAGES.QUANTITY_IS_REQUIRED
          },
          isNumeric: {
            errorMessage: PRODUCT_MESSAGES.QUANTITY_MUST_BE_A_NUMBER
          },
          custom: {
            options: (value) => {
              if (Number(value) <= 0) {
                throw new Error(PRODUCT_MESSAGES.QUANTITY_MUST_BE_GREATER_THAN_0)
              }
              return true
            }
          }
        }
      },
      ['body']
    )
  ),
  updateCart: validate(
    checkSchema(
      {
        buy_count: {
          notEmpty: {
            errorMessage: PRODUCT_MESSAGES.QUANTITY_IS_REQUIRED
          },
          isNumeric: {
            errorMessage: PRODUCT_MESSAGES.QUANTITY_MUST_BE_A_NUMBER
          },
          custom: {
            options: (value) => {
              if (Number(value) <= 0) {
                throw new Error(PRODUCT_MESSAGES.QUANTITY_MUST_BE_GREATER_THAN_0)
              }
              return true
            }
          }
        }
      },
      ['body']
    )
  ),
  deleteProductFromCart: validate(
    checkSchema(
      {
        product_ids: {
          isArray: {
            errorMessage: CART_MESSAGES.PRODUCT_IDS_MUST_BE_A_ARRAY
          },
          custom: {
            options: (value: string[]) => {
              const product_ids = value
              if (product_ids.length === 0) {
                throw new Error(CART_MESSAGES.PRODUCT_IDS_MUST_BE_A_ARRAY)
              }
              product_ids.forEach((id) => {
                if (!ObjectId.isValid(id)) {
                  throw new Error(CART_MESSAGES.PRODUCT_IDS_MUST_BE_A_ARRAY)
                }
              })
              return true
            }
          }
        }
      },
      ['body']
    )
  ),
  buyProducts: validate(
    checkSchema(
      {
        product_ids: {
          isArray: {
            errorMessage: CART_MESSAGES.PRODUCT_IDS_MUST_BE_A_ARRAY
          },
          custom: {
            options: (product_ids: string[]) => {
              if (product_ids.length === 0) {
                throw new Error(CART_MESSAGES.PRODUCT_IDS_MUST_BE_A_ARRAY)
              }
              product_ids.forEach((id) => {
                if (!ObjectId.isValid(id)) {
                  throw new Error(CART_MESSAGES.PRODUCT_IDS_MUST_BE_A_ARRAY)
                }
              })
              return true
            }
          }
        }
      },
      ['body']
    )
  )
}

export default cartMiddleware
