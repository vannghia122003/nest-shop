import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { Category } from '../category/entities/category.entity'
import { OrderStatus } from '../common/types/enum'
import { Order } from '../order/entities/order.entity'
import { Product } from '../product/entities/product.entity'
import { User } from '../user/entities/user.entity'

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async getStats() {
    const [orders, productCount, customerCount] = await Promise.all([
      this.orderRepository.find({ relations: { ordersItem: true } }),
      this.productRepository.count(),
      this.userRepository.count()
    ])
    const totalRevenue = orders.reduce((acc, order) => {
      if (order.status === OrderStatus.COMPLETED) {
        const totalPrice = order.ordersItem.reduce(
          (acc, item) => acc + item.quantity * item.unitPrice,
          0
        )
        return acc + totalPrice
      }
      return acc
    }, 0)

    return {
      totalRevenue,
      customerCount,
      orderCount: orders.length,
      productCount
    }
  }

  async getRevenueByYear(year: number) {
    const orders = await this.orderRepository.find({
      where: { createdAt: Between(new Date(year, 0, 1), new Date(year, 11, 31)) },
      relations: { ordersItem: true }
    })
    const revenueByMonthObj: { [key: string]: number } = {}
    for (let i = 1; i <= 12; i++) {
      const date = `${i}/${year}`
      revenueByMonthObj[date] = 0
    }
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt)
      const year = orderDate.getFullYear()
      const month = orderDate.getMonth()
      if (order.status === OrderStatus.COMPLETED) {
        const totalPrice = order.ordersItem.reduce(
          (acc, item) => acc + item.quantity * item.unitPrice,
          0
        )
        revenueByMonthObj[`${month + 1}/${year}`] += totalPrice
      }
    })

    const revenueByMonth = Object.keys(revenueByMonthObj).map((date) => ({
      date,
      revenue: revenueByMonthObj[date]
    }))

    return revenueByMonth
  }

  async getBestSellingCategories() {
    const [products, categories] = await Promise.all([
      this.productRepository.find({ relations: { category: true } }),
      this.categoryRepository.find()
    ])

    const bestSellingCategoryObj = products.reduce((acc, product) => {
      const categoryId = product.category.id
      if (!acc[categoryId]) {
        acc[categoryId] = 0
      }
      acc[categoryId] += product.sold
      return acc
    }, {})

    const bestSellingCategories = Object.keys(bestSellingCategoryObj).map((categoryId) => ({
      category: categories.find((c) => c.id === Number(categoryId)),
      sold: bestSellingCategoryObj[categoryId]
    }))

    return bestSellingCategories.sort((a, b) => b.sold - a.sold)
  }
}
