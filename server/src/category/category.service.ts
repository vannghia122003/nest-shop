import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { paginate, PaginateQuery } from 'nestjs-paginate'
import { Repository } from 'typeorm'
import { CATEGORY_MESSAGES } from '../common/utils/constants'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category, CATEGORY_PAGINATION_CONFIG } from './entities/category.entity'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepository.save(createCategoryDto)
  }

  findAll(query: PaginateQuery) {
    const page = query.page || 1
    const limit = query.limit || 10
    return paginate({ ...query, limit, page }, this.categoryRepository, CATEGORY_PAGINATION_CONFIG)
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id })
    if (!category) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND)
    return category
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ id })
    if (!category) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND)
    return await this.categoryRepository.save({ ...category, ...updateCategoryDto })
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOneBy({ id })
    if (!category) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND)
    return await this.categoryRepository.remove(category)
  }
}
