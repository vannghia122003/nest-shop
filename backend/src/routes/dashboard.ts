import { Router } from 'express'
import db from '~/config/database'
import catchAsync from '~/utils/catchAsync'

const dashboardRoute = Router()

dashboardRoute.get(
  '/',
  catchAsync(async (req, res) => {
    const productList = await db.products.find().toArray()
    const userList = await db.users.find().toArray()
    const total_views = productList.reduce((total, product) => total + product.view, 0)
    const total_products = productList.length
    const total_products_sold = productList.reduce((total, product) => total + product.sold, 0)
    const total_users = userList.length
    res.json({ total_views, total_products, total_products_sold, total_users })
  })
)

export default dashboardRoute
