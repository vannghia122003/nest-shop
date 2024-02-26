import { Router } from 'express'
import productController from '~/controllers/product.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import { validateIdParams, validatePaginationQuery } from '~/middlewares/common.middleware'
import productMiddleware from '~/middlewares/product.middleware'
import reviewMiddleware from '~/middlewares/review.middleware'
import catchAsync from '~/utils/catchAsync'

const productRoute = Router()

productRoute.get('/', validatePaginationQuery, catchAsync(productController.getProducts))
productRoute.get(
  '/:product_id',
  validateIdParams(['product_id']),
  catchAsync(productController.getProduct)
)
productRoute.get(
  '/:product_id/reviews',
  validateIdParams(['product_id']),
  validatePaginationQuery,
  catchAsync(productController.getProductsReviews)
)
productRoute.get(
  '/:product_id/reviews/:review_id',
  validateIdParams(['product_id', 'review_id']),
  catchAsync(productController.getReview)
)

productRoute.use(authMiddleware.verifyAccessToken)
productRoute.use(authMiddleware.verifyUserStatus)

productRoute.post('/', productMiddleware.createProduct, catchAsync(productController.createProduct))
productRoute.put(
  '/:product_id',
  validateIdParams(['product_id']),
  productMiddleware.updateProduct,
  catchAsync(productController.updateProduct)
)
productRoute.delete(
  '/:product_id',
  validateIdParams(['product_id']),
  catchAsync(productController.deleteProduct)
)

productRoute.put(
  '/:product_id/reviews/:review_id',
  validateIdParams(['product_id', 'review_id']),
  catchAsync(reviewMiddleware.authReview),
  reviewMiddleware.updateReview,
  catchAsync(productController.updateReview)
)

productRoute.delete(
  '/:product_id/reviews/:review_id',
  validateIdParams(['product_id', 'review_id']),
  catchAsync(reviewMiddleware.authReview),
  catchAsync(productController.deleteReview)
)

productRoute.post(
  '/:product_id/reviews',
  validateIdParams(['product_id']),
  reviewMiddleware.createReview,
  catchAsync(productController.createReview)
)

export default productRoute
