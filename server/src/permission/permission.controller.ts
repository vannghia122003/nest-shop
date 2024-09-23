import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate'
import { ResponseMessage } from '../common/decorators/response-message.decorator'
import { PERMISSION_MESSAGES } from '../common/utils/constants'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { PermissionDto } from './dto/permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { PERMISSION_PAGINATION_CONFIG } from './entities/permission.entity'
import { PermissionService } from './permission.service'

@ApiTags('Permission')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ResponseMessage(PERMISSION_MESSAGES.CREATE_SUCCESS)
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto)
  }

  @PaginatedSwaggerDocs(PermissionDto, PERMISSION_PAGINATION_CONFIG)
  @ResponseMessage(PERMISSION_MESSAGES.GET_LIST_SUCCESS)
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.permissionService.findAll(query)
  }

  @ResponseMessage(PERMISSION_MESSAGES.GET_DETAIL_SUCCESS)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.findOne(id)
  }

  @ResponseMessage(PERMISSION_MESSAGES.UPDATE_SUCCESS)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(id, updatePermissionDto)
  }

  @ResponseMessage(PERMISSION_MESSAGES.DELETE_SUCCESS)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.remove(id)
  }
}
