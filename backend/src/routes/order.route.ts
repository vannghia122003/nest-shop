import { Router } from 'express'
import orderController from '~/controllers/order.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import { validateIdParams } from '~/middlewares/common.middleware'
import orderMiddleware from '~/middlewares/order.middleware'
import catchAsync from '~/utils/catchAsync'

const orderRoute = Router()

orderRoute.use(authMiddleware.verifyAccessToken)

orderRoute.get('/', catchAsync(orderController.getOrders))
orderRoute.get('/user', catchAsync(orderController.getUserOrders))

orderRoute.use(authMiddleware.verifyUserStatus)

orderRoute.get('/:order_id', validateIdParams(['order_id']), catchAsync(orderController.getOrder))
orderRoute.put(
  '/:order_id',
  validateIdParams(['order_id']),
  orderMiddleware.updateOrder,
  catchAsync(orderController.updateOrder)
)
orderRoute.delete(
  '/:order_id',
  validateIdParams(['order_id']),
  catchAsync(orderController.deleteOrder)
)

export default orderRoute
