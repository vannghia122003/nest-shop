import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CartItem } from '../cart/entities/cart-item.entity'
import { MailService } from '../mail/mail.service'
import { Product } from '../product/entities/product.entity'
import { OrderItem } from './entities/order-item.entity'
import { Order } from './entities/order.entity'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, CartItem, Product])],
  controllers: [OrderController],
  providers: [OrderService, MailService]
})
export class OrderModule {}
