import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CART_MESSAGES, PRODUCT_MESSAGES, USER_MESSAGES } from '../common/utils/constants'
import { Product } from '../product/entities/product.entity'
import { User } from '../user/entities/user.entity'
import { AddToCartDto } from './dto/add-to-cart.dto'
import { DeleteProductInCartDto } from './dto/delete-product-in-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'
import { CartItem } from './entities/cart-item.entity'

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>
  ) {}

  getCart(userId: number) {
    return this.cartItemRepository.find({
      where: { user: { id: userId } },
      relations: { product: true },
      order: { createdAt: 'DESC' }
    })
  }

  async addToCart(addToCartDto: AddToCartDto, userId: number) {
    const [user, product] = await Promise.all([
      this.userRepository.findOneBy({ id: userId }),
      this.productRepository.findOneBy({ id: addToCartDto.productId })
    ])
    if (!user) throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
    if (!product) throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND)

    const cartItem = await this.cartItemRepository.findOneBy({
      user: { id: userId },
      product: { id: addToCartDto.productId }
    })

    if (cartItem) {
      if (product.stock < cartItem.quantity + addToCartDto.quantity) {
        throw new BadRequestException(CART_MESSAGES.INSUFFICIENT_STOCK)
      }
      cartItem.quantity += addToCartDto.quantity
      await this.cartItemRepository.save(cartItem)
    } else {
      if (product.stock < addToCartDto.quantity) {
        throw new BadRequestException(CART_MESSAGES.INSUFFICIENT_STOCK)
      }
      await this.cartItemRepository.save({ user, product, quantity: addToCartDto.quantity })
    }
  }

  async update(updateCartDto: UpdateCartDto, userId: number) {
    const [product, cartItem] = await Promise.all([
      this.productRepository.findOneBy({ id: updateCartDto.productId }),
      this.cartItemRepository.findOneBy({
        user: { id: userId },
        product: { id: updateCartDto.productId }
      })
    ])
    if (!product) throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND)
    if (!cartItem) throw new NotFoundException(CART_MESSAGES.PRODUCT_NOT_FOUND)

    if (updateCartDto.quantity > product.stock) {
      throw new BadRequestException(CART_MESSAGES.INSUFFICIENT_STOCK)
    } else {
      cartItem.quantity = updateCartDto.quantity
      await this.cartItemRepository.save(cartItem)
    }
  }

  async deleteProductInCart(deleteProductInCartDto: DeleteProductInCartDto, userId: number) {
    await Promise.all(
      deleteProductInCartDto.productIds.map((productId) =>
        this.cartItemRepository.delete({ product: { id: productId }, user: { id: userId } })
      )
    )
  }
}
