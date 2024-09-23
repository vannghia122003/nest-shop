import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate'
import { ResponseMessage } from '../common/decorators/response-message.decorator'
import { USER_MESSAGES } from '../common/utils/constants'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserDto } from './dto/user.dto'
import { USER_PAGINATION_CONFIG } from './entities/user.entity'
import { UserService } from './user.service'

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiOkResponse({ type: UserDto })
  @ResponseMessage(USER_MESSAGES.CREATE_SUCCESS)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @PaginatedSwaggerDocs(UserDto, USER_PAGINATION_CONFIG)
  @ResponseMessage(USER_MESSAGES.GET_LIST_SUCCESS)
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.usersService.findAll(query)
  }

  @ApiOkResponse({ type: UserDto })
  @ResponseMessage(USER_MESSAGES.GET_DETAIL_SUCCESS)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id)
  }

  @ApiOkResponse({ type: UserDto })
  @ResponseMessage(USER_MESSAGES.UPDATE_SUCCESS)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @ApiOkResponse({ type: UserDto })
  @ResponseMessage(USER_MESSAGES.DELETE_SUCCESS)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id)
  }
}
