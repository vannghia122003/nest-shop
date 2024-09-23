import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './product.entity'
import { Review } from './review.entity'

@Entity({ name: 'Photo' })
export class Photo {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  url: string

  @ManyToOne(() => Product, (product) => product.photos)
  product: Product

  @ManyToOne(() => Review, (review) => review.photos, {
    onDelete: 'CASCADE'
  })
  review: Review
}
