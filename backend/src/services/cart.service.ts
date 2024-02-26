import { StatusCodes } from 'http-status-codes'
import { ObjectId, WithId } from 'mongodb'
import db from '~/config/database'
import { CART_MESSAGES, PRODUCT_MESSAGES } from '~/constants/messages'
import Order from '~/models/Order'
import Product from '~/models/Product'
import { AddToCartReqBody } from '~/types/cart'
import { ApiError } from '~/utils/ApiError'
import productService from './product.service'
import Cart from '~/models/Cart'
import { CartDocument } from '~/types/document'

const cartService = {
  async getCart(user_id: string) {
    const cart = await db.carts
      .aggregate<CartDocument>([
        {
          $match: {
            user_id: new ObjectId(user_id)
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
        }
      ])
      .toArray()
    return cart[0]
  },
  async addToCart(user_id: string, body: AddToCartReqBody) {
    const [cart, product] = await Promise.all([
      db.carts.findOne({ user_id: new ObjectId(user_id) }),
      productService.getProductById(body.product_id)
    ])

    if (product.quantity < body.buy_count) {
      throw new ApiError({
        status: StatusCodes.NOT_FOUND,
        message: CART_MESSAGES.PRODUCT_NOT_AVAILABLE
      })
    }
    const productListInCart = [...(cart as WithId<Cart>).products]
    const productIds = productListInCart.map((productLineItem) =>
      productLineItem.product_id.toString()
    )
    const index = productIds.findIndex((productId) => productId === body.product_id)
    if (index !== -1) {
      // sản phẩm đã tồn tại trong giỏ hàng thì tăng số lượng
      productListInCart[index].buy_count = body.buy_count
    } else {
      productListInCart.push({
        product_id: new ObjectId(body.product_id),
        buy_count: body.buy_count
      })
    }
    await db.carts.updateOne(
      { user_id: new ObjectId(user_id) },
      {
        $set: {
          products: productListInCart
        }
      }
    )
    return productListInCart
  },
  async updateCartByProductId(user_id: string, product_id: string, buy_count: number) {
    const [cart, product] = await Promise.all([
      db.carts.findOne({ user_id: new ObjectId(user_id) }),
      productService.getProductById(product_id)
    ])
    const productListInCart = [...(cart as WithId<Cart>).products]
    const index = productListInCart.findIndex(
      (product) => product.product_id.toString() === product_id
    )
    if (index !== -1) {
      if (buy_count > product.quantity) {
        throw new ApiError({
          status: StatusCodes.UNPROCESSABLE_ENTITY,
          message: CART_MESSAGES.QUANTITY_EXCEEDS_AVAILABLE_QUANTITY
        })
      } else {
        productListInCart[index].buy_count = Number(buy_count)
        await db.carts.updateOne(
          { user_id: new ObjectId(user_id) },
          {
            $set: {
              products: productListInCart
            }
          }
        )
      }
    } else {
      throw new ApiError({
        status: StatusCodes.NOT_FOUND,
        message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND
      })
    }
  },
  async deleteProductFromCart(user_id: string, product_ids: string[]) {
    const cart = await db.carts.findOne({ user_id: new ObjectId(user_id) })
    const productListInCart = [...(cart as WithId<Cart>).products]
    const newProductListInCart = productListInCart.filter(
      (product) => !product_ids.includes(product.product_id.toString())
    )
    await db.carts.updateOne(
      { user_id: new ObjectId(user_id) },
      {
        $set: {
          products: newProductListInCart
        }
      }
    )
  },
  async buyProducts(user_id: string, product_ids: string[]) {
    const cart = await db.carts.findOne({ user_id: new ObjectId(user_id) })
    const productListInCart = [...(cart as WithId<Cart>).products]
    if (productListInCart.length === 0) {
      throw new ApiError({
        status: StatusCodes.NOT_FOUND,
        message: CART_MESSAGES.NOT_FOUND_PRODUCT_IN_CART
      })
    }
    const newProductListInCart = productListInCart.filter(
      (productLineItem) => !product_ids.includes(productLineItem.product_id.toString())
    )
    const orderedProduct = productListInCart.filter((productLineItem) =>
      product_ids.includes(productLineItem.product_id.toString())
    )

    if (orderedProduct.length === 0) return

    const itemTotalPrices = await Promise.all(
      orderedProduct.map(async (productLineItem) => {
        const product = (await db.products.findOne({
          _id: new ObjectId(productLineItem.product_id)
        })) as WithId<Product>
        await db.products.updateOne(
          { _id: product._id },
          {
            $set: {
              quantity: product.quantity - productLineItem.buy_count,
              sold: product.sold + productLineItem.buy_count
            }
          }
        )
        return product.price * productLineItem.buy_count
      })
    )
    const total_price = itemTotalPrices.reduce((total, price) => total + price)

    Promise.all([
      db.carts.updateOne(
        { user_id: new ObjectId(user_id) },
        {
          $set: {
            products: newProductListInCart
          }
        }
      )
    ]),
      db.orders.insertOne(
        new Order({ user_id: new ObjectId(user_id), products: orderedProduct, total_price })
      )
  }
}

export default cartService
