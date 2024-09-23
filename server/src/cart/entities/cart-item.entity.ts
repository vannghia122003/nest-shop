import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Product } from '../../product/entities/product.entity'
import { User } from '../../user/entities/user.entity'

@Entity({ name: 'CartItem' })
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  quantity: number

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, (user) => user.cartItem, { onDelete: 'CASCADE' })
  user: User

  @ManyToOne(() => Product, (product) => product.cartItems, {
    onDelete: 'CASCADE' // khi product bị xoá sẽ xoá cart item
  })
  product: Product
}
