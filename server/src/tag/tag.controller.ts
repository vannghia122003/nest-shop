import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate'
import { Public } from '../common/decorators/public.decorator'
import { ResponseMessage } from '../common/decorators/response-message.decorator'
import { TAG_MESSAGES } from '../common/utils/constants'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { Tag, TAG_PAGINATION_CONFIG } from './entities/tag.entity'
import { TagService } from './tag.service'

@ApiTags('Tag')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOkResponse({ type: Tag })
  @ResponseMessage(TAG_MESSAGES.CREATE_SUCCESS)
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto)
  }

  @ApiOkResponse({ type: Tag })
  @PaginatedSwaggerDocs(Tag, TAG_PAGINATION_CONFIG)
  @ResponseMessage(TAG_MESSAGES.GET_LIST_SUCCESS)
  @Public()
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.tagService.findAll(query)
  }

  @ResponseMessage(TAG_MESSAGES.GET_DETAIL_SUCCESS)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.findOne(id)
  }

  @ResponseMessage(TAG_MESSAGES.UPDATE_SUCCESS)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(id, updateTagDto)
  }

  @ResponseMessage(TAG_MESSAGES.DELETE_SUCCESS)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.remove(id)
  }
}
