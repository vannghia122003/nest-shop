import { ObjectId } from 'mongodb'
import db from '~/config/database'
import Category from '~/models/Category'
import { CreateCategoryRequestBody, UpdateCategoryRequestBody } from '~/types/category'
import { PaginationReqQuery } from '~/types/common'

const categoryService = {
  async createCategory(body: CreateCategoryRequestBody) {
    const result = await db.categories.insertOne(
      new Category({ name: body.name, image: body.image })
    )
    const category = await db.categories.findOne({ _id: new ObjectId(result.insertedId) })
    return category
  },

  async getCategories(queryParams?: PaginationReqQuery) {
    const totalDocuments = await db.categories.countDocuments()
    const limit = Number(queryParams?.limit) || totalDocuments || 10
    const page = Number(queryParams?.page) || 1
    const categories = await db.categories
      .find()
      .collation({ locale: 'vi', strength: 2 })
      .sort({ name: 1 })
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()

    return {
      categories,
      page,
      total_pages: Math.ceil(totalDocuments / limit),
      total_results: totalDocuments
    }
  },

  async getCategoryById(category_id: string) {
    const result = await db.categories.findOne({ _id: new ObjectId(category_id) })
    return result
  },

  async deleteCategoryById(category_id: string) {
    const categoryObjectId = new ObjectId(category_id)
    const [category] = await Promise.all([
      db.categories.findOneAndDelete({ _id: categoryObjectId }),
      db.products.updateMany({ category_id: categoryObjectId }, { $set: { category_id: null } })
    ])

    return category
  },

  async updateCategoryById(category_id: string, body: UpdateCategoryRequestBody) {
    const result = await db.categories.findOneAndUpdate(
      { _id: new ObjectId(category_id) },
      {
        $set: { name: body.name, image: body.image },
        $currentDate: { updated_at: true }
      },
      { returnDocument: 'after' }
    )

    return result
  }
}

export default categoryService
