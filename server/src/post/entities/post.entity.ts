import { PaginateConfig } from 'nestjs-paginate'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Tag } from '../../tag/entities/tag.entity'
import { User } from '../../user/entities/user.entity'

@Entity({ name: 'Post' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column({ type: 'text' })
  content: string

  @Column()
  thumbnail: string

  @Column({ default: false })
  isPublished: boolean

  @Column({ update: false, type: 'float' })
  readingTime: number

  @Column({ default: 0 })
  view: number

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => User, (user) => user.posts)
  createdBy: User

  @ManyToMany(() => Tag)
  @JoinTable({ name: 'PostTag' })
  tags: Tag[]
}

export const POST_PAGINATION_CONFIG: PaginateConfig<Post> = {
  defaultLimit: 10,
  maxLimit: -1,
  defaultSortBy: [['createdAt', 'DESC']],
  sortableColumns: ['id', 'title', 'createdAt'],
  searchableColumns: ['title', 'tags.name'],
  ignoreSelectInQueryParam: true,
  relations: ['tags', 'createdBy'],
  select: [
    'id',
    'title',
    'content',
    'description',
    'thumbnail',
    'isPublished',
    'readingTime',
    'view',
    'updatedAt',
    'createdAt',
    'createdBy.id',
    'createdBy.name',
    'createdBy.email',
    'createdBy.avatar',
    'tags.id',
    'tags.name'
  ]
}
