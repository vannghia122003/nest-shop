import { Router } from 'express'
import categoryController from '~/controllers/category.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import categoryMiddleware from '~/middlewares/category.middleware'
import { validateIdParams } from '~/middlewares/common.middleware'
import catchAsync from '~/utils/catchAsync'

const categoryRoute = Router()

categoryRoute.get('/', catchAsync(categoryController.getCategories))
categoryRoute.get(
  '/:category_id',
  validateIdParams(['category_id']),
  catchAsync(categoryController.getCategory)
)

categoryRoute.use(authMiddleware.verifyAccessToken)
categoryRoute.use(authMiddleware.verifyUserStatus)

/* Admin route */
categoryRoute.post(
  '/',
  categoryMiddleware.createCategory,
  catchAsync(categoryController.createCategory)
)
categoryRoute.put(
  '/:category_id',
  validateIdParams(['category_id']),
  categoryMiddleware.updateCategory,
  catchAsync(categoryController.updateCategory)
)
categoryRoute.delete(
  '/:category_id',
  validateIdParams(['category_id']),
  catchAsync(categoryController.deleteCategory)
)

export default categoryRoute
