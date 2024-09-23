import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tag } from '../tag/entities/tag.entity'
import { User } from '../user/entities/user.entity'
import { Post } from './entities/post.entity'
import { PostController } from './post.controller'
import { PostService } from './post.service'

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag, User])],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
