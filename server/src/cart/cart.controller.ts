import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { JwtDecoded } from '../common/decorators/jwt-decoded.decorator'
import { ResponseMessage } from '../common/decorators/response-message.decorator'
import { SkipEmailVerification } from '../common/decorators/skip-email-verification.decorator'
import { IJwtDecoded } from '../common/types/interface'
import { CART_MESSAGES } from '../common/utils/constants'
import { CartService } from './cart.service'
import { AddToCartDto } from './dto/add-to-cart.dto'
import { DeleteProductInCartDto } from './dto/delete-product-in-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ResponseMessage(CART_MESSAGES.ADD_SUCCESS)
  @Post('add-to-cart')
  addToCart(@Body() addToCartDto: AddToCartDto, @JwtDecoded() jwtDecoded: IJwtDecoded) {
    return this.cartService.addToCart(addToCartDto, jwtDecoded.userId)
  }

  @ResponseMessage(CART_MESSAGES.RETRIEVE_SUCCESS)
  @SkipEmailVerification()
  @Get()
  getCart(@JwtDecoded() jwtDecoded: IJwtDecoded) {
    return this.cartService.getCart(jwtDecoded.userId)
  }

  @ResponseMessage(CART_MESSAGES.UPDATE_SUCCESS)
  @Put('update')
  update(@Body() updateCartDto: UpdateCartDto, @JwtDecoded() jwtDecoded: IJwtDecoded) {
    return this.cartService.update(updateCartDto, jwtDecoded.userId)
  }

  @ResponseMessage(CART_MESSAGES.REMOVE_SUCCESS)
  @Delete('delete')
  deleteProductInCart(
    @Body() deleteProductInCartDto: DeleteProductInCartDto,
    @JwtDecoded() jwtDecoded: IJwtDecoded
  ) {
    return this.cartService.deleteProductInCart(deleteProductInCartDto, jwtDecoded.userId)
  }
}
