import { StatusCodes } from 'http-status-codes'
import pick from 'lodash/pick'
import { ObjectId } from 'mongodb'
import db from '~/config/database'
import { PRODUCT_MESSAGES } from '~/constants/messages'
import Product from '~/models/Product'
import Review from '~/models/Review'
import { PaginationReqQuery } from '~/types/common'
import { ProductDocument } from '~/types/document'
import {
  Attributes,
  CreateProductReqBody,
  CreateReviewReqBody,
  GetProductsReqQuery,
  UpdateProductReqBody,
  UpdateProductType,
  UpdateReviewReqBody
} from '~/types/product'
import { ApiError } from '~/utils/ApiError'

const productService = {
  async createProduct(body: CreateProductReqBody) {
    const attributes = body.attributes?.map((item) => pick(item, ['key', 'value']) as Attributes)
    const result = await db.products.insertOne(
      new Product({
        name: body.name,
        description: body.description,
        quantity: body.quantity,
        price: body.price,
        rating: body.rating,
        image: body.image,
        images: body.images,
        attributes,
        category_id: body.category_id,
        sold: body.sold,
        view: body.view,
        review: body.review
      })
    )
    const product = await db.products.findOne({ _id: new ObjectId(result.insertedId) })
    return product
  },
  async getProducts(queryParams: GetProductsReqQuery) {
    const { sort_by, order, name, category_id, rating, price_min, price_max } = queryParams
    const limit = Number(queryParams.limit) || 10
    const page = Number(queryParams.page) || 1
    const pipeline: any[] = [
      { $match: {} },
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          category_id: 0,
          category: {
            created_at: 0,
            updated_at: 0
          }
        }
      }
    ]

    if (category_id) {
      pipeline[0]['$match'] = {
        category_id: new ObjectId(category_id)
      }
    }
    if (name?.trim()) {
      pipeline[0]['$match'] = {
        ...pipeline[0]['$match'],
        $text: {
          $search: `"${name.trim()}"`
        }
      }
    }

    if (sort_by) {
      if (sort_by === 'popular') {
        pipeline.push({
          $sort: {
            view: -1
          }
        })
      } else if (sort_by === 'price') {
        if (order === 'desc') {
          pipeline.push({
            $sort: {
              price: -1
            }
          })
        } else {
          pipeline.push({
            $sort: {
              price: 1
            }
          })
        }
      } else if (sort_by === 'sold') {
        pipeline.push({
          $sort: {
            sold: -1
          }
        })
      } else {
        pipeline.push({
          $sort: {
            created_at: -1
          }
        })
      }
    } else {
      pipeline.push({
        $sort: {
          view: -1
        }
      })
    }

    if (rating && [1, 2, 3, 4, 5].includes(Number(rating))) {
      pipeline[0]['$match'] = {
        ...pipeline[0]['$match'],
        rating: {
          $gte: Number(rating)
        }
      }
    }

    if (price_min && Number(price_min)) {
      pipeline[0]['$match'] = {
        ...pipeline[0]['$match'],
        price: {
          $gte: Number(price_min)
        }
      }
    }
    if (price_max && Number(price_max)) {
      pipeline[0]['$match'] = {
        ...pipeline[0]['$match'],
        price: {
          ...pipeline[0]['$match']['price'],
          $lte: Number(price_max)
        }
      }
    }

    const [products, total] = await Promise.all([
      db.products
        .aggregate<ProductDocument>([
          ...pipeline,
          {
            $skip: limit * (page - 1)
          },
          { $limit: limit }
        ])
        .toArray(),
      db.products
        .aggregate([
          ...pipeline,
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])
    const totalDocuments = total[0]?.total || 0
    return {
      products,
      page,
      total_pages: Math.ceil(totalDocuments / limit),
      total_results: totalDocuments
    }
  },
  async getProductById(product_id: string) {
    await db.products.updateOne(
      { _id: new ObjectId(product_id) },
      {
        $inc: { view: 1 }
      }
    )
    const product = await db.products
      .aggregate<ProductDocument>([
        {
          $match: {
            _id: new ObjectId(product_id)
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category_id',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: {
            path: '$category',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            category_id: 0,
            category: {
              created_at: 0,
              updated_at: 0
            }
          }
        }
      ])
      .toArray()
    return product[0]
  },
  async updateProductById(product_id: string, body: UpdateProductReqBody) {
    const attributes =
      body.attributes?.map((item) => pick(item, ['key', 'value']) as Attributes) || []
    const updateBody = pick(body, [
      'name',
      'description',
      'quantity',
      'price',
      'image',
      'images',
      'view',
      'sold',
      'rating',
      'category_id',
      'review'
    ]) as UpdateProductType
    if (updateBody.category_id) {
      updateBody.category_id = new ObjectId(updateBody.category_id)
    }
    if (updateBody.quantity) {
      updateBody.quantity = Number(updateBody.quantity)
    }
    if (updateBody.view) {
      updateBody.view = Number(updateBody.view)
    }
    if (updateBody.sold) {
      updateBody.sold = Number(updateBody.sold)
    }
    if (updateBody.rating) {
      updateBody.rating = Number(updateBody.rating)
    }
    if (updateBody.review) {
      updateBody.review = Number(updateBody.review)
    }

    const product = await db.products.findOneAndUpdate(
      { _id: new ObjectId(product_id) },
      {
        $set: { ...updateBody, attributes },
        $currentDate: { updated_at: true }
      },
      { returnDocument: 'after' }
    )
    return product
  },
  async deleteProductById(product_id: string) {
    const result = await db.products.findOneAndDelete({ _id: new ObjectId(product_id) })
    if (result === null) {
      throw new ApiError({
        status: StatusCodes.NOT_FOUND,
        message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND
      })
    }
    return result
  },
  async createReviewByProductId(user_id: string, product_id: string, body: CreateReviewReqBody) {
    const { comment, rating } = body
    const result = await db.reviews.insertOne(new Review({ user_id, product_id, comment, rating }))
    const reviews = await db.reviews.find({ product_id: new ObjectId(product_id) }).toArray()
    const total_rating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    const [review] = await Promise.all([
      db.reviews.findOne({ _id: result.insertedId }),
      db.products.updateOne(
        { _id: new ObjectId(product_id) },
        {
          $set: {
            rating: parseFloat(total_rating.toFixed(1)),
            review: reviews.length
          }
        }
      )
    ])
    return review
  },
  async getProductsReviews(product_id: string, queryParams: PaginationReqQuery) {
    const limit = Number(queryParams.limit) || 5
    const page = Number(queryParams.page) || 1
    const [reviews, totalDocuments] = await Promise.all([
      db.reviews
        .aggregate([
          {
            $match: {
              product_id: new ObjectId(product_id)
            }
          },
          {
            $sort: {
              review_date: -1
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },

          {
            $project: {
              _id: 1,
              product_id: 1,
              comment: 1,
              rating: 1,
              review_date: 1,
              user: {
                _id: 1,
                name: 1,
                avatar: 1
              }
            }
          }
        ])
        .toArray(),
      db.reviews.countDocuments({ product_id: new ObjectId(product_id) })
    ])
    return {
      reviews,
      page,
      total_pages: Math.ceil(totalDocuments / limit),
      total_results: totalDocuments
    }
  },
  async getReviewById(product_id: string, review_id: string) {
    const result = await db.reviews
      .aggregate([
        {
          $match: {
            _id: new ObjectId(review_id),
            product_id: new ObjectId(product_id)
          }
        },
        {
          $sort: {
            review_date: -1
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        {
          $unwind: {
            path: '$user'
          }
        },
        {
          $project: {
            _id: 1,
            product_id: 1,
            comment: 1,
            rating: 1,
            review_date: 1,
            user: {
              _id: 1,
              name: 1,
              avatar: 1
            }
          }
        }
      ])
      .toArray()
    return result[0]
  },
  async updateReviewById(product_id: string, review_id: string, body: UpdateReviewReqBody) {
    const { comment, rating } = body
    const result = await db.reviews.findOneAndUpdate(
      {
        _id: new ObjectId(review_id),
        product_id: new ObjectId(product_id)
      },
      {
        $set: {
          comment,
          rating: Number(rating)
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return result
  },
  async deleteReviewById(product_id: string, review_id: string) {
    await db.reviews.deleteOne({
      _id: new ObjectId(review_id),
      product_id: new ObjectId(product_id)
    })
    const reviews = await db.reviews.find({ product_id: new ObjectId(product_id) }).toArray()
    const total_rating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    await db.products.updateOne(
      { _id: new ObjectId(product_id) },
      {
        $set: {
          rating: parseFloat(total_rating.toFixed(1)),
          review: reviews.length
        }
      }
    )
  }
}

export default productService
