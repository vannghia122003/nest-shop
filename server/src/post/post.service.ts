import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import omit from 'lodash/omit'
import { paginate, PaginateQuery } from 'nestjs-paginate'
import readingTime from 'reading-time'
import { Repository } from 'typeorm'
import { POST_MESSAGES, USER_MESSAGES } from '../common/utils/constants'
import { Tag } from '../tag/entities/tag.entity'
import { User } from '../user/entities/user.entity'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { Post, POST_PAGINATION_CONFIG } from './entities/post.entity'

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    let tags: Tag[] = []
    if (createPostDto.tagIds.length > 0) {
      tags = await this.tagRepository.find({
        where: createPostDto.tagIds.map((tag) => ({ id: tag })),
        select: { id: true, name: true }
      })
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: { id: true, name: true, email: true, avatar: true }
    })
    if (!user) throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
    return this.postRepository.save({
      ...omit(createPostDto, ['tagIds']),
      readingTime: readingTime(createPostDto.content).minutes,
      tags,
      createdBy: user
    })
  }

  findAll(query: PaginateQuery) {
    const page = query.page || 1
    const limit = query.limit || 10
    return paginate({ ...query, limit, page }, this.postRepository, POST_PAGINATION_CONFIG)
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: { tags: true, createdBy: true },
      select: {
        tags: { id: true, name: true },
        createdBy: { id: true, name: true, email: true, avatar: true }
      }
    })
    if (!post) throw new NotFoundException(POST_MESSAGES.NOT_FOUND)
    await this.postRepository.increment({ id: post.id }, 'view', 1)
    return post
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: { tags: true, createdBy: true },
      select: {
        tags: { id: true, name: true },
        createdBy: { id: true, name: true, email: true, avatar: true }
      }
    })
    if (!post) throw new NotFoundException(POST_MESSAGES.NOT_FOUND)

    if (updatePostDto.tagIds) {
      if (updatePostDto.tagIds.length > 0) {
        post.tags = await this.tagRepository.find({
          where: updatePostDto.tagIds.map((tag) => ({ id: tag })),
          select: { id: true, name: true }
        })
      } else {
        post.tags = []
      }
    }
    return this.postRepository.save({ ...post, ...omit(updatePostDto, ['tagIds']) })
  }

  async remove(id: number) {
    const post = await this.findOne(id)
    if (!post) throw new NotFoundException(POST_MESSAGES.NOT_FOUND)
    return await this.postRepository.remove(post)
  }
}
