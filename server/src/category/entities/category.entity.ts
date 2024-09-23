import { PaginateConfig } from 'nestjs-paginate'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Product } from '../../product/entities/product.entity'

@Entity({ name: 'Category' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  thumbnail: string

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @OneToMany(() => Product, (product) => product.category)
  products: Product[]
}

export const CATEGORY_PAGINATION_CONFIG: PaginateConfig<Category> = {
  defaultLimit: 10,
  maxLimit: -1,
  defaultSortBy: [['createdAt', 'DESC']],
  sortableColumns: ['id', 'name', 'createdAt'],
  searchableColumns: ['name'],
  ignoreSelectInQueryParam: true
}
