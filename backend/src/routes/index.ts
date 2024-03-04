import { Router } from 'express'
import authRoute from './auth.route'
import userRoute from './user.route'
import categoryRoute from './category.route'
import productRoute from './product.route'
import roleRoute from './role.route'
import cartRoute from './cart.route'
import orderRoute from './order.route'
import permissionRoute from './permission.route'
import roleMiddleware from '~/middlewares/role.middleware'
import dashboardRoute from './dashboard'
import notificationRoute from './notification.route'

const routes = Router()

routes.use(roleMiddleware.checkPermission)

routes.use('/auth', authRoute)
routes.use('/users', userRoute)
routes.use('/categories', categoryRoute)
routes.use('/products', productRoute)
routes.use('/roles', roleRoute)
routes.use('/cart', cartRoute)
routes.use('/orders', orderRoute)
routes.use('/permissions', permissionRoute)
routes.use('/notifications', notificationRoute)
routes.use('/dashboard', dashboardRoute)

export default routes
