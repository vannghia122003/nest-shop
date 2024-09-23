import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from '../category/entities/category.entity'
import { User } from '../user/entities/user.entity'
import { Photo } from './entities/photo.entity'
import { Product } from './entities/product.entity'
import { Review } from './entities/review.entity'
import { Specifications } from './entities/specifications.entity'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
  imports: [TypeOrmModule.forFeature([Product, Specifications, Category, Photo, Review, User])],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
