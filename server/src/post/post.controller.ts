import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate'
import { JwtDecoded } from '../common/decorators/jwt-decoded.decorator'
import { Public } from '../common/decorators/public.decorator'
import { ResponseMessage } from '../common/decorators/response-message.decorator'
import { IJwtDecoded } from '../common/types/interface'
import { POST_MESSAGES } from '../common/utils/constants'
import { CreatePostDto } from './dto/create-post.dto'
import { PostDto } from './dto/post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { POST_PAGINATION_CONFIG } from './entities/post.entity'
import { PostService } from './post.service'

@ApiTags('Post')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ResponseMessage(POST_MESSAGES.CREATE_SUCCESS)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @JwtDecoded() jwtDecoded: IJwtDecoded) {
    return this.postService.create(createPostDto, jwtDecoded.userId)
  }

  @ApiOkResponse({ type: PostDto })
  @PaginatedSwaggerDocs(PostDto, POST_PAGINATION_CONFIG)
  @ResponseMessage(POST_MESSAGES.GET_LIST_SUCCESS)
  @Public()
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.postService.findAll(query)
  }

  @ApiOkResponse({ type: PostDto })
  @ResponseMessage(POST_MESSAGES.GET_DETAIL_SUCCESS)
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id)
  }

  @ApiOkResponse({ type: PostDto })
  @ResponseMessage(POST_MESSAGES.UPDATE_SUCCESS)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto)
  }

  @ApiOkResponse({ type: PostDto })
  @ResponseMessage(POST_MESSAGES.DELETE_SUCCESS)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id)
  }
}
