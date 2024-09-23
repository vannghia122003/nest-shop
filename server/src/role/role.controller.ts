import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate'
import { ResponseMessage } from '../common/decorators/response-message.decorator'
import { ROLE_MESSAGE } from '../common/utils/constants'
import { CreateRoleDto } from './dto/create-role.dto'
import { RoleDto } from './dto/role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { ROLE_PAGINATION_CONFIG } from './entities/role.entity'
import { RoleService } from './role.service'

@ApiTags('Role')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ResponseMessage(ROLE_MESSAGE.CREATE_SUCCESS)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }

  @PaginatedSwaggerDocs(RoleDto, ROLE_PAGINATION_CONFIG)
  @ResponseMessage(ROLE_MESSAGE.GET_LIST_SUCCESS)
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.roleService.findAll(query)
  }

  @ResponseMessage(ROLE_MESSAGE.GET_DETAIL_SUCCESS)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id)
  }

  @ResponseMessage(ROLE_MESSAGE.UPDATE_SUCCESS)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto)
  }

  @ResponseMessage(ROLE_MESSAGE.DELETE_SUCCESS)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id)
  }
}
