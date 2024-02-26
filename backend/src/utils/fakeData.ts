import { CreateReviewReqBody } from '~/types/product'
import { faker } from '@faker-js/faker'
import db from '~/config/database'
import productService from '~/services/product.service'

const createRandomReview = () => {
  const review: CreateReviewReqBody = {
    comment: faker.lorem.paragraph({ min: 10, max: 15 }),
    rating: Math.floor(Math.random() * 5) + 1
  }
  return review
}

const insertMultipleReview = async () => {
  const products = await db.products.find().toArray()
  console.log('Creating review ...')
  console.log('Waiting ...')
  let count = 0
  const result = await Promise.all(
    products.map(async (product) => {
      await Promise.all([
        productService.createReviewByProductId(
          '657c1754ba32ea451650d290',
          product._id.toString(),
          createRandomReview()
        ),
        productService.createReviewByProductId(
          '657c1754ba32ea451650d290',
          product._id.toString(),
          createRandomReview()
        )
      ])
      count += 2
      console.log(`Create ${count} reviews`)
    })
  )
  return result
}

insertMultipleReview()
