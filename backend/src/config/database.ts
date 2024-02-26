import 'dotenv/config'
import { Collection, Db, MongoClient } from 'mongodb'
import Category from '~/models/Category'
import Product from '~/models/Product'
import RefreshToken from '~/models/RefreshToken'
import Role from '~/models/Role'
import User from '~/models/User'
import env from './environment'
import Order from '~/models/Order'
import Cart from '~/models/Cart'
import Permission from '~/models/Permission'
import Review from '~/models/Review'
import Notification from '~/models/Notification'

class Database {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(env.MONGODB_URI)
    this.db = this.client.db(env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  initIndex() {
    Promise.all([
      this.createIndexUsers(),
      this.createIndexRefreshTokens(),
      this.createIndexProducts(),
      this.createIndexCarts(),
      this.createIndexOrders(),
      this.createIndexReviews()
    ])
  }

  async createIndexUsers() {
    const exists = await this.users.indexExists(['email_1_password_1', 'email_1'])
    if (!exists) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
    }
  }

  async createIndexRefreshTokens() {
    const exists = await this.refreshTokens.indexExists(['exp_1', 'token_1'])
    if (!exists) {
      this.refreshTokens.createIndex({ token: 1 })
      this.refreshTokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
    }
  }

  async createIndexProducts() {
    const exists = await this.products.indexExists(['name_text'])
    if (!exists) {
      this.products.createIndex({ name: 'text' }, { default_language: 'none' })
    }
  }

  async createIndexCarts() {
    const exists = await this.products.indexExists(['user_id_1'])
    if (!exists) {
      this.carts.createIndex({ user_id: 1 })
    }
  }

  async createIndexOrders() {
    const exists = await this.products.indexExists(['user_id_1'])
    if (!exists) {
      this.orders.createIndex({ user_id: 1 })
    }
  }

  async createIndexReviews() {
    const exists = await this.reviews.indexExists(['product_id', '_id_1_product_id_1'])
    if (!exists) {
      this.reviews.createIndex({ product_id: 1 })
      this.reviews.createIndex({ _id: 1, product_id: 1 })
    }
  }

  get users(): Collection<User> {
    return this.db.collection('users')
  }
  get roles(): Collection<Role> {
    return this.db.collection('roles')
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection('refresh_tokens')
  }
  get categories(): Collection<Category> {
    return this.db.collection('categories')
  }
  get products(): Collection<Product> {
    return this.db.collection('products')
  }
  get carts(): Collection<Cart> {
    return this.db.collection('carts')
  }
  get orders(): Collection<Order> {
    return this.db.collection('orders')
  }
  get reviews(): Collection<Review> {
    return this.db.collection('reviews')
  }
  get notifications(): Collection<Notification> {
    return this.db.collection('notifications')
  }
  get permissions(): Collection<Permission> {
    return this.db.collection('permissions')
  }
}

// tạo 1 instance từ class Database
const db = new Database()

export default db
