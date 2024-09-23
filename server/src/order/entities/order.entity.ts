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
import { OrderStatus } from '../../common/types/enum'
import { User } from '../../user/entities/user.entity'
import { OrderItem } from './order-item.entity'

@Entity({ name: 'Order' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: OrderStatus

  @Column()
  province: string

  @Column()
  district: string

  @Column()
  ward: string

  @Column()
  address: string

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, (user) => user.orders)
  user: User

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  ordersItem: OrderItem[]
}

export const ORDER_PAGINATION_CONFIG: PaginateConfig<Order> = {
  defaultLimit: 10,
  maxLimit: -1,
  defaultSortBy: [['createdAt', 'DESC']],
  sortableColumns: ['id', 'createdAt'],
  searchableColumns: ['status'],
  relations: ['user', 'ordersItem'],
  ignoreSelectInQueryParam: true
}
