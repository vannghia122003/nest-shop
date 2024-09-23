import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './product.entity'

@Entity({ name: 'Specifications' })
export class Specifications {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  key: string

  @Column()
  value: string

  @ManyToOne(() => Product, (product) => product.specifications)
  product: Product
}
