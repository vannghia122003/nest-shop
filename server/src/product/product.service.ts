import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import omit from 'lodash/omit'
import { paginate, PaginateQuery } from 'nestjs-paginate'
import { Repository } from 'typeorm'
import { Category } from '../category/entities/category.entity'
import {
  CATEGORY_MESSAGES,
  PRODUCT_MESSAGES,
  REVIEW_MESSAGES,
  USER_MESSAGES
} from '../common/utils/constants'
import categoriesData from '../common/utils/data/categories-data'
import productsData from '../common/utils/data/products-data'
import { Config } from '../config/env.config'
import { User } from '../user/entities/user.entity'
import { CreateProductDto } from './dto/create-product.dto'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Photo } from './entities/photo.entity'
import { Product, PRODUCT_PAGINATION_CONFIG } from './entities/product.entity'
import { Review, REVIEW_PAGINATION_CONFIG } from './entities/review.entity'
import { Specifications } from './entities/specifications.entity'

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    private configService: ConfigService<Config, true>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Specifications)
    private specificationsRepository: Repository<Specifications>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>
  ) {}

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({ id: createProductDto.categoryId })
    if (!category) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND)
    const photos = await this.photoRepository.save(
      createProductDto.photos.map((photo) => ({ url: photo }))
    )

    return this.productRepository.save({
      ...omit(createProductDto, ['categoryId']),
      category,
      photos
    })
  }

  findAll(query: PaginateQuery) {
    const page = query.page || 1
    const limit = query.limit || 10
    return paginate({ ...query, limit, page }, this.productRepository, PRODUCT_PAGINATION_CONFIG)
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true, specifications: true, photos: true }
    })
    if (!product) throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND)
    await this.productRepository.increment({ id: product.id }, 'view', 1)
    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const [product, category] = await Promise.all([
      this.productRepository.findOne({
        where: { id },
        relations: { category: true, specifications: true, photos: true }
      }),
      this.categoryRepository.findOneBy({ id: updateProductDto.categoryId })
    ])
    if (!product) throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND)
    if (!category) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND)

    if (updateProductDto.specifications) {
      const [attributes] = await Promise.all([
        this.specificationsRepository.save(updateProductDto.specifications),
        this.specificationsRepository.remove(product.specifications)
      ])
      product.specifications = attributes
    }

    if (updateProductDto.photos) {
      const [photos] = await Promise.all([
        this.photoRepository.save(updateProductDto.photos.map((photo) => ({ url: photo }))),
        this.photoRepository.remove(product.photos)
      ])
      product.photos = photos
    }

    return this.productRepository.save({
      ...product,
      ...omit(updateProductDto, ['specifications', 'categoryId', 'photos']),
      category
    })
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true, specifications: true, photos: true }
    })
    if (!product) throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND)
    await Promise.all([
      this.photoRepository.remove(product.photos),
      this.specificationsRepository.remove(product.specifications)
    ])
    return await this.productRepository.remove(product)
  }

  async createReview(createReviewDto: CreateReviewDto, productId: number, userId: number) {
    const product = await this.productRepository.findOneBy({ id: productId })
    if (!product) throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND)
    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
    const photos = await this.photoRepository.save(
      createReviewDto.photos.map((photo) => ({ url: photo }))
    )

    const review = await this.reviewRepository.save({ ...createReviewDto, user, product, photos })
    const reviews = await this.reviewRepository.find({ where: { product: { id: productId } } })
    const totalRating = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    await this.productRepository.update(
      { id: productId },
      { rating: Number(totalRating.toFixed(1)) }
    )
    return review
  }

  async findAllReviews(productId: number, query: PaginateQuery) {
    const product = await this.productRepository.findOneBy({ id: productId })
    if (!product) throw new NotFoundException(PRODUCT_MESSAGES.NOT_FOUND)

    const page = query.page || 1
    const limit = query.limit || 10
    const filter = { 'product.id': String(productId) }

    return paginate(
      { ...query, limit, page, filter },
      this.reviewRepository,
      REVIEW_PAGINATION_CONFIG
    )
  }

  async findOneReview(productId: number, reviewId: number) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, product: { id: productId } },
      relations: { user: true, product: true, photos: true }
    })
    if (!review) throw new NotFoundException(REVIEW_MESSAGES.NOT_FOUND)
    return review
  }

  async removeReview(productId: number, reviewId: number) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, product: { id: productId } },
      relations: { user: true, product: true, photos: true }
    })
    if (!review) throw new NotFoundException(REVIEW_MESSAGES.NOT_FOUND)
    return await this.reviewRepository.remove(review)
  }

  async onModuleInit() {
    const isInitData = this.configService.get('INIT_DATA')
    if (isInitData) {
      await this.categoryRepository.insert(categoriesData)
      await Promise.all(productsData.map((product) => this.create(product)))
    }
  }
}
