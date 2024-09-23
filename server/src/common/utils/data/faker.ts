import { fakerVI as faker } from '@faker-js/faker'
import { hashString } from '../bcrypt'

const createRandomUser = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password: hashString('123123'),
  dateOfBirth: faker.date.birthdate(),
  avatar: 'https://avatars.githubusercontent.com/u/90377899',
  isActive: true,
  role: { id: 2 }
})

export const createRandomReview = () => ({
  comment: faker.lorem.paragraph({ min: 10, max: 20 }),
  rating: Math.floor(Math.random() * 5) + 1,
  photos: []
})

export const usersData = faker.helpers.multiple(createRandomUser, {
  count: 20
})
