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
import { User } from '../../user/entities/user.entity'
import { Photo } from './photo.entity'
import { Product } from './product.entity'

@Entity({ name: 'Review' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  rating: number

  @Column()
  comment: string

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @OneToMany(() => Photo, (photo) => photo.review)
  photos: Photo[]

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE'
  })
  product: Product
}

export const REVIEW_PAGINATION_CONFIG: PaginateConfig<Review> = {
  defaultLimit: 10,
  maxLimit: -1,
  defaultSortBy: [['createdAt', 'DESC']],
  sortableColumns: ['id', 'createdAt'],
  filterableColumns: { 'product.id': true },
  searchableColumns: ['rating'],
  relations: ['user', 'product', 'photos'],
  ignoreSelectInQueryParam: true
}
