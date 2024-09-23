import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { paginate, PaginateQuery } from 'nestjs-paginate'
import { Repository } from 'typeorm'
import { TAG_MESSAGES } from '../common/utils/constants'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { Tag, TAG_PAGINATION_CONFIG } from './entities/tag.entity'

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>
  ) {}

  async create(createTagDto: CreateTagDto) {
    return this.tagRepository.save(createTagDto)
  }

  findAll(query: PaginateQuery) {
    const page = query.page || 1
    const limit = query.limit || 10
    return paginate({ ...query, limit, page }, this.tagRepository, TAG_PAGINATION_CONFIG)
  }

  async findOne(id: number) {
    const tag = await this.tagRepository.findOneBy({ id })
    if (!tag) throw new NotFoundException(TAG_MESSAGES.NOT_FOUND)
    return tag
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id)
    if (!tag) throw new NotFoundException(TAG_MESSAGES.NOT_FOUND)
    return await this.tagRepository.save({ ...tag, ...updateTagDto })
  }

  async remove(id: number) {
    const tag = await this.findOne(id)
    if (!tag) throw new NotFoundException(TAG_MESSAGES.NOT_FOUND)
    return await this.tagRepository.remove(tag)
  }
}
