import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from '../product/entities/product.entity'
import { User } from '../user/entities/user.entity'
import { CartController } from './cart.controller'
import { CartService } from './cart.service'
import { CartItem } from './entities/cart-item.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Product, User])],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
