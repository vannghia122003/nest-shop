import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from '../category/entities/category.entity'
import { Order } from '../order/entities/order.entity'
import { Product } from '../product/entities/product.entity'
import { User } from '../user/entities/user.entity'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Order, Category])],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
