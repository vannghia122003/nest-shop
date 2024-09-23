import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { paginate, PaginateQuery } from 'nestjs-paginate'
import { Repository } from 'typeorm'
import { CartItem } from '../cart/entities/cart-item.entity'
import { OrderStatus } from '../common/types/enum'
import { CART_MESSAGES, ORDER_MESSAGES } from '../common/utils/constants'
import { MailService } from '../mail/mail.service'
import { Product } from '../product/entities/product.entity'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { OrderItem } from './entities/order-item.entity'
import { Order, ORDER_PAGINATION_CONFIG } from './entities/order.entity'

@Injectable()
export class OrderService {
  constructor(
    private mailService: MailService,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number, email: string) {
    const productsInCart = await this.cartItemRepository.find({
      where: { user: { id: userId } },
      relations: { product: true },
      order: { createdAt: 'DESC' }
    })
    if (productsInCart.length === 0) {
      throw new NotFoundException(ORDER_MESSAGES.CART_IS_EMPTY)
    }
    const isExceeded = productsInCart.some((cartItem) => cartItem.quantity > cartItem.product.stock)
    if (isExceeded) throw new BadRequestException(CART_MESSAGES.INSUFFICIENT_STOCK)
    const order = await this.orderRepository.save({
      ...createOrderDto,
      status: OrderStatus.PROCESSING,
      user: { id: userId }
    })
    await Promise.all(
      productsInCart.map(async (cartItem) => {
        await Promise.all([
          this.orderItemRepository.insert({
            product: cartItem.product,
            quantity: cartItem.quantity,
            unitPrice: (cartItem.product.price * (100 - cartItem.product.discount)) / 100,
            order
          }),
          this.productRepository.decrement({ id: cartItem.product.id }, 'stock', cartItem.quantity),
          this.productRepository.increment({ id: cartItem.product.id }, 'sold', cartItem.quantity)
        ])
      })
    )
    await this.cartItemRepository.delete({ user: { id: userId } })
    this.mailService.sendThankYouEmail({ to: email, subject: 'Thank you!' })
  }

  findAll(query: PaginateQuery) {
    const page = query.page || 1
    const limit = query.limit || 10
    return paginate({ ...query, limit, page }, this.orderRepository, ORDER_PAGINATION_CONFIG)
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { ordersItem: { product: true }, user: true }
    })
    if (!order) throw new NotFoundException(ORDER_MESSAGES.NOT_FOUND)
    return order
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { ordersItem: { product: true }, user: true }
    })
    if (!order) throw new NotFoundException(ORDER_MESSAGES.NOT_FOUND)
    return await this.orderRepository.save({ ...order, ...updateOrderDto })
  }

  async remove(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { ordersItem: { product: true }, user: true }
    })
    if (!order) throw new NotFoundException(ORDER_MESSAGES.NOT_FOUND)
    return await this.orderRepository.remove(order)
  }
}
