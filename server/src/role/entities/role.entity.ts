import { PaginateConfig } from 'nestjs-paginate'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Permission } from '../../permission/entities/permission.entity'
import { User } from '../../user/entities/user.entity'

@Entity({ name: 'Role' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @OneToMany(() => User, (user) => user.role)
  users: User[]

  @ManyToMany(() => Permission)
  @JoinTable({ name: 'RolePermission' })
  permissions: Permission[]
}

export const ROLE_PAGINATION_CONFIG: PaginateConfig<Role> = {
  defaultLimit: 10,
  maxLimit: -1,
  defaultSortBy: [['createdAt', 'DESC']],
  sortableColumns: ['id', 'createdAt'],
  searchableColumns: ['name', 'description'],
  ignoreSelectInQueryParam: true
}
