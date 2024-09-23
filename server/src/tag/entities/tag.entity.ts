import { PaginateConfig } from 'nestjs-paginate'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'Tag' })
export class Tag {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date
}

export const TAG_PAGINATION_CONFIG: PaginateConfig<Tag> = {
  defaultLimit: 10,
  maxLimit: -1,
  defaultSortBy: [['createdAt', 'DESC']],
  sortableColumns: ['id', 'name', 'createdAt'],
  searchableColumns: ['name'],
  ignoreSelectInQueryParam: true
}

