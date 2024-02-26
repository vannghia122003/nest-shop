import { Router } from 'express'
import cartController from '~/controllers/cart.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import cartMiddleware from '~/middlewares/cart.middleware'
import { validateIdParams } from '~/middlewares/common.middleware'
import catchAsync from '~/utils/catchAsync'

const cartRoute = Router()

cartRoute.use(authMiddleware.verifyAccessToken)

cartRoute.get('/', catchAsync(cartController.get))

cartRoute.use(authMiddleware.verifyUserStatus)

cartRoute.post('/', cartMiddleware.addToCart, catchAsync(cartController.add))
cartRoute.put(
  '/:id',
  validateIdParams(['id']),
  cartMiddleware.updateCart,
  catchAsync(cartController.update)
)
cartRoute.delete('/', cartMiddleware.deleteProductFromCart, catchAsync(cartController.delete))
cartRoute.post('/buy-products', cartMiddleware.buyProducts, catchAsync(cartController.buyProducts))

export default cartRoute
