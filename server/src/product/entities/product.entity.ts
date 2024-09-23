import { PaginateConfig } from 'nestjs-paginate'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { CartItem } from '../../cart/entities/cart-item.entity'
import { Category } from '../../category/entities/category.entity'
import { OrderItem } from '../../order/entities/order-item.entity'
import { Photo } from './photo.entity'
import { Review } from './review.entity'
import { Specifications } from './specifications.entity'

@Entity({ name: 'Product' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  thumbnail: string

  @Column({ type: 'float', default: 0 })
  discount: number

  @Column()
  price: number

  @Column()
  stock: number

  @Column({ default: 0 })
  sold: number

  @Column({ default: 0 })
  view: number

  @Column({ type: 'float', default: 0 })
  rating: number

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => Category, (category) => category.products)
  category: Category

  @OneToMany(() => Photo, (photo) => photo.product)
  photos: Photo[]

  @OneToMany(() => Specifications, (specifications) => specifications.product, { cascade: true })
  specifications: Specifications[]

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[]

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[]

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[]
}

export const PRODUCT_PAGINATION_CONFIG: PaginateConfig<Product> = {
  defaultLimit: 10,
  maxLimit: -1,
  defaultSortBy: [['createdAt', 'DESC']],
  sortableColumns: ['id', 'name', 'createdAt', 'price', 'view', 'sold'],
  searchableColumns: ['name', 'category.id'],
  relations: ['category'],
  ignoreSelectInQueryParam: true,
  filterableColumns: { price: true, rating: true, name: true }
}
