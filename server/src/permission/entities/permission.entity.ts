import { PaginateConfig } from 'nestjs-paginate'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'Permission' })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  path: string

  @Column()
  method: string

  @Column()
  module: string

  @Column()
  description: string

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date
}

export const PERMISSION_PAGINATION_CONFIG: PaginateConfig<Permission> = {
  defaultLimit: 10,
  maxLimit: -1,
  defaultSortBy: [['createdAt', 'DESC']],
  sortableColumns: ['id', 'createdAt'],
  searchableColumns: ['module', 'description'],
  ignoreSelectInQueryParam: true
}
