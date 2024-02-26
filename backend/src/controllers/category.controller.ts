import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { StatusCodes } from 'http-status-codes'
import { CATEGORY_MESSAGES } from '~/constants/messages'
import categoryService from '~/services/category.service'
import { CategoryIdReqParams, CreateCategoryRequestBody } from '~/types/category'
import { PaginationReqQuery } from '~/types/common'

const categoryController = {
  async createCategory(
    req: Request<ParamsDictionary, any, CreateCategoryRequestBody>,
    res: Response
  ) {
    const result = await categoryService.createCategory(req.body)
    res.status(StatusCodes.CREATED).json({
      message: CATEGORY_MESSAGES.CREATE_CATEGORY_SUCCESS,
      result
    })
  },
  async getCategories(req: Request<ParamsDictionary, any, any, PaginationReqQuery>, res: Response) {
    const { categories, page, total_pages, total_results } = await categoryService.getCategories(
      req.query
    )
    res.json({
      message: CATEGORY_MESSAGES.GET_CATEGORIES_SUCCESS,
      result: categories,
      page,
      total_pages,
      total_results
    })
  },
  async getCategory(req: Request<CategoryIdReqParams>, res: Response) {
    const result = await categoryService.getCategoryById(req.params.category_id)
    if (result === null) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
      })
    }
    res.json({
      message: CATEGORY_MESSAGES.GET_CATEGORY_SUCCESS,
      result
    })
  },
  async updateCategory(req: Request<CategoryIdReqParams>, res: Response) {
    const result = await categoryService.updateCategoryById(req.params.category_id, req.body)
    if (result === null) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
      })
    }
    res.json({
      message: CATEGORY_MESSAGES.UPDATE_CATEGORY_SUCCESS,
      result
    })
  },
  async deleteCategory(req: Request<CategoryIdReqParams>, res: Response) {
    const result = await categoryService.deleteCategoryById(req.params.category_id)
    if (result === null) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: CATEGORY_MESSAGES.CATEGORY_NOT_FOUND
      })
    }

    res.status(StatusCodes.NO_CONTENT).send()
  }
}

export default categoryController
