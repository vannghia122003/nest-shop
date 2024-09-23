import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate'
import { Public } from '../common/decorators/public.decorator'
import { ResponseMessage } from '../common/decorators/response-message.decorator'
import { CATEGORY_MESSAGES } from '../common/utils/constants'
import { CategoryService } from './category.service'
import { CategoryDto } from './dto/category.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { CATEGORY_PAGINATION_CONFIG } from './entities/category.entity'

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiCreatedResponse({ type: CategoryDto })
  @ResponseMessage(CATEGORY_MESSAGES.CREATE_SUCCESS)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto)
  }

  @ApiOkResponse({ type: CategoryDto })
  @PaginatedSwaggerDocs(CategoryDto, CATEGORY_PAGINATION_CONFIG)
  @ResponseMessage(CATEGORY_MESSAGES.GET_LIST_SUCCESS)
  @Public()
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.categoryService.findAll(query)
  }

  @ApiOkResponse({ type: CategoryDto })
  @ResponseMessage(CATEGORY_MESSAGES.GET_DETAIL_SUCCESS)
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id)
  }

  @ApiOkResponse({ type: CategoryDto })
  @ResponseMessage(CATEGORY_MESSAGES.UPDATE_SUCCESS)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto)
  }

  @ApiOkResponse({ type: CategoryDto })
  @ResponseMessage(CATEGORY_MESSAGES.DELETE_SUCCESS)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id)
  }
}
