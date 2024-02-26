import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { StatusCodes } from 'http-status-codes'
import { ORDER_MESSAGES } from '~/constants/messages'
import orderService from '~/services/order.service'
import { GetOrdersReqQuery, OrderIdReqParams, UpdateOrderReqBody } from '~/types/order'
import { TokenPayload } from '~/utils/jwt'

const orderController = {
  async getOrders(req: Request<ParamsDictionary, any, any, GetOrdersReqQuery>, res: Response) {
    const { orders, page, total_pages, total_results } = await orderService.getOrders(req.query)
    res.json({
      message: ORDER_MESSAGES.GET_ORDERS_SUCCESS,
      result: orders,
      page,
      total_pages,
      total_results
    })
  },
  async getUserOrders(req: Request<ParamsDictionary, any, any, GetOrdersReqQuery>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { orders, page, total_pages, total_results } = await orderService.getOrders(
      req.query,
      user_id
    )
    res.json({
      message: ORDER_MESSAGES.GET_ORDERS_SUCCESS,
      result: orders,
      page,
      total_pages,
      total_results
    })
  },
  async getOrder(req: Request<OrderIdReqParams>, res: Response) {
    const result = await orderService.getOrderById(req.params.order_id)
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ORDER_MESSAGES.ORDER_NOT_FOUND
      })
    }
    res.json({
      message: ORDER_MESSAGES.GET_ORDERS_SUCCESS,
      result
    })
  },
  async updateOrder(req: Request<OrderIdReqParams, any, UpdateOrderReqBody>, res: Response) {
    const result = await orderService.updateOrder(req.params.order_id, req.body)
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: ORDER_MESSAGES.ORDER_NOT_FOUND
      })
    }
    res.json({
      message: ORDER_MESSAGES.UPDATE_ORDER_SUCCESS,
      result
    })
  },
  async deleteOrder(req: Request<OrderIdReqParams>, res: Response) {
    await orderService.deleteOrder(req.params.order_id)
    res.status(StatusCodes.NO_CONTENT).send()
  }
}
export default orderController
