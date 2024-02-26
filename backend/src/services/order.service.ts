import { ObjectId } from 'mongodb'
import db from '~/config/database'
import { OrderStatus } from '~/constants/enums'
import { UpdateOrderReqBody, GetOrdersReqQuery } from '~/types/order'

const orderService = {
  async getOrders(queryParams: GetOrdersReqQuery, user_id?: string) {
    const orderStatus = Number(queryParams.status)
    const filterObj = user_id ? { user_id: new ObjectId(user_id) } : {}
    const totalDocuments = await db.orders.countDocuments(filterObj)
    const limit = Number(queryParams?.limit) || totalDocuments || 10

    const page = Number(queryParams?.page) || 1
    const pipeline: any[] = [
      { $match: {} },
      {
        $unwind: {
          path: '$products',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products.product_id',
          foreignField: '_id',
          as: 'products.product_detail'
        }
      },
      {
        $unwind: {
          path: '$products.product_detail',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          user: {
            $first: '$$ROOT'
          },
          products: {
            $push: '$products'
          }
        }
      },
      {
        $project: {
          _id: 1,
          user: 1,
          products: {
            $cond: {
              if: {
                $eq: ['$products.product_detail', []]
              },
              then: [],
              else: '$products'
            }
          }
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$user',
              {
                products: '$products'
              }
            ]
          }
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
          user: {
            password: 0,
            email_verify_token: 0,
            reset_password_token: 0
          },
          user_id: 0
        }
      }
    ]
    if (
      [
        OrderStatus.Processing,
        OrderStatus.Shipping,
        OrderStatus.Completed,
        OrderStatus.Cancelled
      ].includes(orderStatus)
    ) {
      pipeline[0]['$match']['status'] = orderStatus
    }
    if (user_id) {
      pipeline[0]['$match']['user_id'] = new ObjectId(user_id)
    }

    const orders = await db.orders
      .aggregate(pipeline)
      .sort({ order_date: -1 })
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()
    return {
      orders,
      page,
      total_pages: Math.ceil(totalDocuments / limit),
      total_results: totalDocuments
    }
  },
  async getOrderById(order_id: string) {
    const order = await db.orders
      .aggregate([
        {
          $match: {
            _id: new ObjectId(order_id)
          }
        },
        {
          $unwind: {
            path: '$products',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product_id',
            foreignField: '_id',
            as: 'products.product_detail'
          }
        },
        {
          $unwind: {
            path: '$products.product_detail',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$_id',
            user: {
              $first: '$$ROOT'
            },
            products: {
              $push: '$products'
            }
          }
        },
        {
          $project: {
            _id: 1,
            user: 1,
            products: {
              $cond: {
                if: {
                  $eq: ['$products.product_detail', []]
                },
                then: [],
                else: '$products'
              }
            }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                '$user',
                {
                  products: '$products'
                }
              ]
            }
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
            user: {
              password: 0,
              email_verify_token: 0,
              reset_password_token: 0
            },
            user_id: 0
          }
        }
      ])
      .toArray()
    return order[0]
  },
  async updateOrder(order_id: string, body: UpdateOrderReqBody) {
    const order = await db.orders.findOneAndUpdate(
      {
        _id: new ObjectId(order_id)
      },
      {
        $set: {
          status: Number(body.status)
        }
      },
      {
        returnDocument: 'after'
      }
    )

    return order
  },
  async deleteOrder(order_id: string) {
    await db.orders.deleteOne({ _id: new ObjectId(order_id) })
  }
}

export default orderService
