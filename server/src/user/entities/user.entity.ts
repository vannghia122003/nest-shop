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
import { RefreshToken } from '../../auth/entities/refresh-token.entity'
import { CartItem } from '../../cart/entities/cart-item.entity'
import { Order } from '../../order/entities/order.entity'
import { Post } from '../../post/entities/post.entity'
import { Review } from '../../product/entities/review.entity'
import { Role } from '../../role/entities/role.entity'

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column({ select: false })
  password: string

  @Column({ nullable: true, type: 'datetime' })
  dateOfBirth: Date | null

  @Column({ nullable: true, type: 'varchar' })
  avatar: string | null

  @Column({ nullable: true, type: 'varchar' })
  phone: string | null

  @Column({ nullable: true, type: 'varchar' })
  address: string | null

  @Column({ default: false })
  isActive: boolean

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => Role, (role) => role.users)
  role: Role

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[]

  @OneToMany(() => Post, (post) => post.createdBy)
  posts: Post[]

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItem: CartItem[]

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[]

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[]
}

export const USER_PAGINATION_CONFIG: PaginateConfig<User> = {
  defaultLimit: 10,
  maxLimit: -1,
  defaultSortBy: [['createdAt', 'DESC']],
  sortableColumns: ['id', 'name', 'createdAt'],
  searchableColumns: ['name', 'email'],
  ignoreSelectInQueryParam: true
}
