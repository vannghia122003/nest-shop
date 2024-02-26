import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import db from '~/config/database'
import { RolesId } from '~/constants/enums'
import { AUTH_MESSAGES, REVIEW_MESSAGES } from '~/constants/messages'
import { ReviewIdReqParams, UpdateReviewReqBody } from '~/types/product'
import { ApiError } from '~/utils/ApiError'
import { TokenPayload } from '~/utils/jwt'
import validate from './validate'

const reviewMiddleware = {
  createReview: validate(
    checkSchema(
      {
        comment: {
          trim: true,
          notEmpty: {
            errorMessage: REVIEW_MESSAGES.COMMENT_IS_REQUIRED
          },
          isString: {
            errorMessage: REVIEW_MESSAGES.COMMENT_MUST_BE_A_STRING
          },
          isLength: {
            options: {
              min: 6
            },
            errorMessage: REVIEW_MESSAGES.COMMENT_AT_LEAST_6_CHARACTERS
          }
        },
        rating: {
          notEmpty: {
            errorMessage: REVIEW_MESSAGES.RATING_IS_REQUIRED
          },
          isNumeric: {
            errorMessage: REVIEW_MESSAGES.RATING_MUST_BE_A_NUMBER_FROM_1_TO_5
          },
          isIn: {
            options: [[1, 2, 3, 4, 5]],
            errorMessage: REVIEW_MESSAGES.RATING_MUST_BE_A_NUMBER_FROM_1_TO_5
          }
        }
      },
      ['body']
    )
  ),
  updateReview: validate(
    checkSchema(
      {
        comment: {
          trim: true,
          notEmpty: {
            errorMessage: REVIEW_MESSAGES.COMMENT_IS_REQUIRED
          },
          isString: {
            errorMessage: REVIEW_MESSAGES.COMMENT_MUST_BE_A_STRING
          },
          isLength: {
            options: {
              min: 6
            },
            errorMessage: REVIEW_MESSAGES.COMMENT_AT_LEAST_6_CHARACTERS
          }
        },
        rating: {
          notEmpty: {
            errorMessage: REVIEW_MESSAGES.RATING_IS_REQUIRED
          },
          isNumeric: {
            errorMessage: REVIEW_MESSAGES.RATING_MUST_BE_A_NUMBER_FROM_1_TO_5
          },
          isIn: {
            options: [[1, 2, 3, 4, 5]],
            errorMessage: REVIEW_MESSAGES.RATING_MUST_BE_A_NUMBER_FROM_1_TO_5
          }
        }
      },
      ['body']
    )
  ),
  async authReview(
    req: Request<ReviewIdReqParams, any, UpdateReviewReqBody>,
    res: Response,
    next: NextFunction
  ) {
    const { user_id, role } = req.decoded_authorization as TokenPayload
    const { product_id, review_id } = req.params
    if (role._id === RolesId.SuperAdmin) return next()
    const review = await db.reviews.findOne({
      _id: new ObjectId(review_id),
      product_id: new ObjectId(product_id)
    })
    if (!review) {
      throw new ApiError({
        status: StatusCodes.NOT_FOUND,
        message: REVIEW_MESSAGES.REVIEW_NOT_FOUND
      })
    }
    if (review.user_id.toString() !== user_id) {
      throw new ApiError({ status: StatusCodes.FORBIDDEN, message: AUTH_MESSAGES.ACCESS_DENIED })
    }
    next()
  }
}

export default reviewMiddleware
