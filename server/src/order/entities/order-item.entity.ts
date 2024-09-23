import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from '../../product/entities/product.entity'
import { Order } from './order.entity'

@Entity({ name: 'OrderItem' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  quantity: number

  @Column()
  unitPrice: number

  @ManyToOne(() => Order, (order) => order.ordersItem, {
    onDelete: 'CASCADE' // khi order bị xoá sẽ xoá order item
  })
  order: Order

  @ManyToOne(() => Product, (product) => product.orderItems)
  product: Product
}
