import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { StatusCodes } from 'http-status-codes'
import { CART_MESSAGES } from '~/constants/messages'
import cartService from '~/services/cart.service'
import { IdReqParams } from '~/types/common'
import {
  AddToCartReqBody,
  BuyProductsReqBody,
  DeleteCartReqBody,
  UpdateCartReqBody
} from '~/types/cart'
import { TokenPayload } from '~/utils/jwt'

const cartController = {
  async get(req: Request, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const cart = await cartService.getCart(user_id)
    res.json({
      message: CART_MESSAGES.GET_CART_SUCCESS,
      result: cart.products
    })
  },
  async add(req: Request<ParamsDictionary, any, AddToCartReqBody>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    await cartService.addToCart(user_id, req.body)
    res.status(StatusCodes.CREATED).json({
      message: CART_MESSAGES.ADD_TO_CART_SUCCESS
    })
  },
  async update(req: Request<IdReqParams, any, UpdateCartReqBody>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    await cartService.updateCartByProductId(user_id, req.params.id, req.body.buy_count)
    res.json({
      message: CART_MESSAGES.UPDATE_CART_SUCCESS
    })
  },
  async delete(req: Request<ParamsDictionary, any, DeleteCartReqBody>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    await cartService.deleteProductFromCart(user_id, req.body.product_ids)
    res.json({
      message: CART_MESSAGES.DELETE_PRODUCT_FROM_CART_SUCCESS
    })
  },

  async buyProducts(req: Request<ParamsDictionary, any, BuyProductsReqBody>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    await cartService.buyProducts(user_id, req.body.product_ids)
    res.json({
      message: CART_MESSAGES.BUY_PRODUCTS_SUCCESS
    })
  }
}

export default cartController
