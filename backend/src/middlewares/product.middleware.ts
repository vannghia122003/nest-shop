import { checkSchema } from 'express-validator'
import validate from './validate'
import { CATEGORY_MESSAGES, PRODUCT_MESSAGES, USER_MESSAGES } from '~/constants/messages'
import categoryService from '~/services/category.service'
import { ObjectId } from 'mongodb'
import { regexUrl } from '~/constants/regex'

const productMiddleware = {
  createProduct: validate(
    checkSchema(
      {
        name: {
          trim: true,
          notEmpty: {
            errorMessage: PRODUCT_MESSAGES.PRODUCT_NAME_IS_REQUIRED
          },
          isString: {
            errorMessage: PRODUCT_MESSAGES.PRODUCT_NAME_MUST_BE_A_STRING
          }
        },
        description: {
          trim: true,
          notEmpty: {
            errorMessage: PRODUCT_MESSAGES.DESCRIPTION_IS_REQUIRED
          },
          isString: {
            errorMessage: PRODUCT_MESSAGES.DESCRIPTION_MUST_BE_A_STRING
          }
        },
        quantity: {
          notEmpty: {
            errorMessage: PRODUCT_MESSAGES.QUANTITY_IS_REQUIRED
          },
          isNumeric: {
            errorMessage: PRODUCT_MESSAGES.QUANTITY_MUST_BE_A_NUMBER
          },
          custom: {
            options: (value) => {
              const quantity = Number(value)
              if (quantity <= 0) {
                throw new Error(PRODUCT_MESSAGES.QUANTITY_MUST_BE_GREATER_THAN_0)
              }
              return true
            }
          }
        },
        price: {
          notEmpty: {
            errorMessage: PRODUCT_MESSAGES.PRICE_IS_REQUIRED
          },
          isNumeric: {
            errorMessage: PRODUCT_MESSAGES.PRICE_MUST_BE_A_NUMBER
          },
          custom: {
            options: (value) => {
              const price = Number(value)
              if (price <= 0) {
                throw new Error(PRODUCT_MESSAGES.PRICE_MUST_BE_GREATER_THAN_0)
              }
              return true
            }
          }
        },
        image: {
          trim: true,
          notEmpty: {
            errorMessage: PRODUCT_MESSAGES.IMAGE_IS_REQUIRED
          },
          isURL: {
            errorMessage: USER_MESSAGES.URL_IS_INVALID
          }
        },
        images: {
          optional: true,
          isArray: true,
          custom: {
            options: (value: []) => {
              value.forEach((item) => {
                if (typeof item !== 'string' || !regexUrl.test(item)) {
                  throw new Error(PRODUCT_MESSAGES.IMAGES_MUST_BE_URL_ARRAY)
                }
              })
              return true
            }
          }
        },
        category_id: {
          optional: true,
          custom: {
            options: async (value) => {
              if (value === '') {
                return true
              }
              const { categories } = await categoryService.getCategories()
              const categoryIds = categories.map((category) => category._id.toString())
              if (!ObjectId.isValid(value) || !categoryIds.includes(value)) {
                throw new Error(CATEGORY_MESSAGES.CATEGORY_ID_IS_INVALID)
              }

              return true
            }
          }
        },
        view: {
          optional: true,
          isNumeric: {
            errorMessage: PRODUCT_MESSAGES.VALUE_MUST_BE_A_NUMBER
          },
          custom: {
            options: (value) => {
              const view = Number(value)
              if (view < 0) {
                throw new Error(PRODUCT_MESSAGES.VALUE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0)
              }
              return true
            }
          }
        },
        sold: {
          optional: true,
          isNumeric: {
            errorMessage: PRODUCT_MESSAGES.VALUE_MUST_BE_A_NUMBER
          },
          custom: {
            options: (value) => {
              const sold = Number(value)
              if (sold < 0) {
                throw new Error(PRODUCT_MESSAGES.VALUE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0)
              }
              return true
            }
          }
        },
        review: {
          optional: true,
          isNumeric: {
            errorMessage: PRODUCT_MESSAGES.VALUE_MUST_BE_A_NUMBER
          },
          custom: {
            options: (value) => {
              const sold = Number(value)
              if (sold < 0) {
                throw new Error(PRODUCT_MESSAGES.VALUE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0)
              }
              return true
            }
          }
        },
        rating: {
          optional: true,
          isFloat: {
            errorMessage: PRODUCT_MESSAGES.RATING_MUST_BE_A_NUMBER_FROM_1_TO_5,
            options: {
              min: 1,
              max: 5
            }
          }
        }
      },
      ['body']
    )
  ),
  updateProduct: validate(
    checkSchema(
      {
        name: {
          trim: true,
          notEmpty: {
            errorMessage: PRODUCT_MESSAGES.PRODUCT_NAME_IS_REQUIRED
          },
          isString: {
            errorMessage: PRODUCT_MESSAGES.PRODUCT_NAME_MUST_BE_A_STRING
          }
        },
        description: {
          trim: true,
          notEmpty: {
            errorMessage: PRODUCT_MESSAGES.DESCRIPTION_IS_REQUIRED
          },
          isString: {
            errorMessage: PRODUCT_MESSAGES.DESCRIPTION_MUST_BE_A_STRING
          }
        },
        quantity: {
          notEmpty: {
            errorMessage: PRODUCT_MESSAGES.QUANTITY_IS_REQUIRED
          },
          isNumeric: {
            errorMessage: PRODUCT_MESSAGES.QUANTITY_MUST_BE_A_NUMBER
          },
          custom: {
            options: (value) => {
              const quantity = Number(value)
              if (quantity <= 0) {
                throw new Error(PRODUCT_MESSAGES.QUANTITY_MUST_BE_GREATER_THAN_0)
              }
              return true
            }
          }
        },
        price: {
          notEmpty: {
            errorMessage: PRODUCT_MESSAGES.PRICE_IS_REQUIRED
          },
          isNumeric: {
            errorMessage: PRODUCT_MESSAGES.PRICE_MUST_BE_A_NUMBER
          },
          custom: {
            options: (value) => {
              const price = Number(value)
              if (price <= 0) {
                throw new Error(PRODUCT_MESSAGES.PRICE_MUST_BE_GREATER_THAN_0)
              }
              return true
            }
          }
        },
        image: {
          trim: true,
          notEmpty: {
            errorMessage: PRODUCT_MESSAGES.IMAGE_IS_REQUIRED
          },
          isURL: {
            errorMessage: USER_MESSAGES.URL_IS_INVALID
          }
        },
        images: {
          isArray: true,
          custom: {
            options: (value: []) => {
              value.forEach((item) => {
                if (typeof item !== 'string' || !regexUrl.test(item)) {
                  throw new Error(PRODUCT_MESSAGES.IMAGES_MUST_BE_URL_ARRAY)
                }
              })
              return true
            }
          }
        },
        category_id: {
          optional: true,
          custom: {
            options: async (value) => {
              if (value === '') {
                return true
              }
              const { categories } = await categoryService.getCategories()
              const categoryIds = categories.map((category) => category._id.toString())
              if (!ObjectId.isValid(value) || !categoryIds.includes(value)) {
                throw new Error(CATEGORY_MESSAGES.CATEGORY_ID_IS_INVALID)
              }

              return true
            }
          }
        },
        view: {
          optional: true,
          isNumeric: {
            errorMessage: PRODUCT_MESSAGES.VALUE_MUST_BE_A_NUMBER
          },
          custom: {
            options: (value) => {
              const view = Number(value)
              if (view < 0) {
                throw new Error(PRODUCT_MESSAGES.VALUE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0)
              }
              return true
            }
          }
        },
        sold: {
          optional: true,
          isNumeric: {
            errorMessage: PRODUCT_MESSAGES.VALUE_MUST_BE_A_NUMBER
          },
          custom: {
            options: (value) => {
              const sold = Number(value)
              if (sold < 0) {
                throw new Error(PRODUCT_MESSAGES.VALUE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0)
              }
              return true
            }
          }
        },
        review: {
          optional: true,
          isNumeric: {
            errorMessage: PRODUCT_MESSAGES.VALUE_MUST_BE_A_NUMBER
          },
          custom: {
            options: (value) => {
              const sold = Number(value)
              if (sold < 0) {
                throw new Error(PRODUCT_MESSAGES.VALUE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0)
              }
              return true
            }
          }
        },
        rating: {
          optional: true,
          isFloat: {
            errorMessage: PRODUCT_MESSAGES.RATING_MUST_BE_A_NUMBER_FROM_1_TO_5,
            options: {
              min: 1,
              max: 5
            }
          }
        }
      },
      ['body']
    )
  )
}

export default productMiddleware
