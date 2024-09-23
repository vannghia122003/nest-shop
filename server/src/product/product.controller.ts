import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate'
import { JwtDecoded } from '../common/decorators/jwt-decoded.decorator'
import { Public } from '../common/decorators/public.decorator'
import { ResponseMessage } from '../common/decorators/response-message.decorator'
import { IJwtDecoded } from '../common/types/interface'
import { PRODUCT_MESSAGES, REVIEW_MESSAGES } from '../common/utils/constants'
import { CreateProductDto } from './dto/create-product.dto'
import { CreateReviewDto } from './dto/create-review.dto'
import { ProductDto } from './dto/product.dto'
import { ReviewDto } from './dto/review.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { PRODUCT_PAGINATION_CONFIG } from './entities/product.entity'
import { REVIEW_PAGINATION_CONFIG } from './entities/review.entity'
import { ProductService } from './product.service'

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiCreatedResponse({ type: ProductDto })
  @ResponseMessage(PRODUCT_MESSAGES.CREATE_SUCCESS)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto)
  }

  @ApiOkResponse({ type: ProductDto })
  @PaginatedSwaggerDocs(ProductDto, PRODUCT_PAGINATION_CONFIG)
  @ResponseMessage(PRODUCT_MESSAGES.GET_LIST_SUCCESS)
  @Public()
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.productService.findAll(query)
  }

  @ApiOkResponse({ type: ProductDto })
  @ResponseMessage(PRODUCT_MESSAGES.GET_DETAIL_SUCCESS)
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id)
  }

  @ApiOkResponse({ type: ProductDto })
  @ResponseMessage(PRODUCT_MESSAGES.UPDATE_SUCCESS)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto)
  }

  @ApiOkResponse({ type: ProductDto })
  @ResponseMessage(PRODUCT_MESSAGES.DELETE_SUCCESS)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id)
  }

  @ResponseMessage(REVIEW_MESSAGES.CREATE_SUCCESS)
  @Post(':productId/reviews')
  createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Param('productId', ParseIntPipe) productId: number,
    @JwtDecoded() jwtDecoded: IJwtDecoded
  ) {
    return this.productService.createReview(createReviewDto, productId, jwtDecoded.userId)
  }

  @ApiOkResponse({ type: ReviewDto })
  @PaginatedSwaggerDocs(ReviewDto, REVIEW_PAGINATION_CONFIG)
  @ResponseMessage(REVIEW_MESSAGES.GET_LIST_SUCCESS)
  @Public()
  @Get(':productId/reviews')
  findAllReviews(
    @Param('productId', ParseIntPipe) productId: number,
    @Paginate() query: PaginateQuery
  ) {
    return this.productService.findAllReviews(productId, query)
  }

  @ResponseMessage(REVIEW_MESSAGES.GET_DETAIL_SUCCESS)
  @Get(':productId/reviews/:reviewId')
  findOneReview(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number
  ) {
    return this.productService.findOneReview(productId, reviewId)
  }

  @ResponseMessage(REVIEW_MESSAGES.DELETE_SUCCESS)
  @Delete(':productId/reviews/:reviewId')
  removeReview(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number
  ) {
    return this.productService.removeReview(productId, reviewId)
  }
}
