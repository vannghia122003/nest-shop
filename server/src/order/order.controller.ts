import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate'
import { JwtDecoded } from '../common/decorators/jwt-decoded.decorator'
import { ResponseMessage } from '../common/decorators/response-message.decorator'
import { IJwtDecoded } from '../common/types/interface'
import { ORDER_MESSAGES } from '../common/utils/constants'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderDto } from './dto/order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { ORDER_PAGINATION_CONFIG } from './entities/order.entity'
import { OrderService } from './order.service'

@ApiTags('Order')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ResponseMessage(ORDER_MESSAGES.CREATE_SUCCESS)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @JwtDecoded() jwtDecoded: IJwtDecoded) {
    return this.orderService.create(createOrderDto, jwtDecoded.userId, jwtDecoded.email)
  }

  @PaginatedSwaggerDocs(OrderDto, ORDER_PAGINATION_CONFIG)
  @ResponseMessage(ORDER_MESSAGES.GET_LIST_SUCCESS)
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.orderService.findAll(query)
  }

  @ResponseMessage(ORDER_MESSAGES.GET_DETAIL_SUCCESS)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id)
  }

  @ResponseMessage(ORDER_MESSAGES.UPDATE_SUCCESS)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto)
  }

  @ResponseMessage(ORDER_MESSAGES.DELETE_SUCCESS)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id)
  }
}
