import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { StatusCodes } from 'http-status-codes'
import { PRODUCT_MESSAGES, REVIEW_MESSAGES } from '~/constants/messages'
import productService from '~/services/product.service'
import { PaginationReqQuery } from '~/types/common'
import {
  CreateProductReqBody,
  CreateReviewReqBody,
  GetProductsReqQuery,
  ProductIdReqParams,
  ReviewIdReqParams,
  UpdateProductReqBody,
  UpdateReviewReqBody
} from '~/types/product'
import { TokenPayload } from '~/utils/jwt'

const productController = {
  async createProduct(req: Request<ParamsDictionary, any, CreateProductReqBody>, res: Response) {
    const result = await productService.createProduct(req.body)
    res.status(StatusCodes.CREATED).json({
      message: PRODUCT_MESSAGES.CREATE_PRODUCT_SUCCESS,
      result
    })
  },

  async getProducts(req: Request<ParamsDictionary, any, any, GetProductsReqQuery>, res: Response) {
    const { products, page, total_pages, total_results } = await productService.getProducts(
      req.query
    )
    res.json({
      message: PRODUCT_MESSAGES.GET_PRODUCTS_SUCCESS,
      result: products,
      page,
      total_pages,
      total_results
    })
  },

  async getProduct(req: Request<ProductIdReqParams>, res: Response) {
    const product = await productService.getProductById(req.params.product_id)
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND
      })
    }

    res.json({
      message: PRODUCT_MESSAGES.GET_PRODUCT_SUCCESS,
      result: product
    })
  },

  async updateProduct(req: Request<ProductIdReqParams, any, UpdateProductReqBody>, res: Response) {
    const product = await productService.updateProductById(req.params.product_id, req.body)
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND
      })
    }
    res.json({
      message: PRODUCT_MESSAGES.UPDATE_PRODUCT_SUCCESS,
      result: product
    })
  },
  async deleteProduct(req: Request<ProductIdReqParams>, res: Response) {
    await productService.deleteProductById(req.params.product_id)
    res.status(StatusCodes.NO_CONTENT).send()
  },
  async createReview(req: Request<ProductIdReqParams, any, CreateReviewReqBody>, res: Response) {
    const { user_id } = req.decoded_authorization as TokenPayload
    const product_id = req.params.product_id
    const result = await productService.createReviewByProductId(user_id, product_id, req.body)
    res.status(StatusCodes.CREATED).json({
      message: REVIEW_MESSAGES.CREATE_REVIEW_SUCCESS,
      result
    })
  },
  async getProductsReviews(
    req: Request<ProductIdReqParams, any, any, PaginationReqQuery>,
    res: Response
  ) {
    const product_id = req.params.product_id
    const { page, reviews, total_pages, total_results } = await productService.getProductsReviews(
      product_id,
      req.query
    )
    res.json({
      message: REVIEW_MESSAGES.GET_REVIEWS_SUCCESS,
      result: reviews,
      page,
      total_pages,
      total_results
    })
  },
  async getReview(req: Request<ReviewIdReqParams>, res: Response) {
    const { product_id, review_id } = req.params
    const result = await productService.getReviewById(product_id, review_id)
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: REVIEW_MESSAGES.REVIEW_NOT_FOUND
      })
    }
    res.json({
      message: REVIEW_MESSAGES.GET_REVIEW_SUCCESS,
      result
    })
  },
  async updateReview(req: Request<ReviewIdReqParams, any, UpdateReviewReqBody>, res: Response) {
    const { product_id, review_id } = req.params
    const result = await productService.updateReviewById(product_id, review_id, req.body)
    if (result === null) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: REVIEW_MESSAGES.REVIEW_NOT_FOUND
      })
    }
    res.json({
      message: REVIEW_MESSAGES.UPDATE_REVIEW_SUCCESS,
      result
    })
  },
  async deleteReview(req: Request<ReviewIdReqParams>, res: Response) {
    const { product_id, review_id } = req.params
    await productService.deleteReviewById(product_id, review_id)
    res.status(StatusCodes.NO_CONTENT).json({
      message: REVIEW_MESSAGES.DELETE_REVIEW_SUCCESS
    })
  }
}

export default productController
