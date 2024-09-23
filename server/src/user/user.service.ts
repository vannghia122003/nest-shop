import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import omit from 'lodash/omit'
import { paginate, PaginateQuery } from 'nestjs-paginate'
import { Repository } from 'typeorm'
import { z } from 'zod'
import { hashString } from '../common/utils/bcrypt'
import { AUTH_MESSAGES, ROLE_MESSAGE, USER_MESSAGES } from '../common/utils/constants'
import { Role } from '../role/entities/role.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User, USER_PAGINATION_CONFIG } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  async checkEmailExists(email: string) {
    try {
      const schema = z.string().refine(
        async (email) => {
          return !(await this.userRepository.existsBy({ email }))
        },
        { message: 'Email already exists', path: ['email'] }
      )
      await schema.parseAsync(email)
    } catch (error) {
      throw new UnprocessableEntityException(error)
    }
  }

  async create(createUserDto: CreateUserDto) {
    const [role] = await Promise.all([
      this.roleRepository.findOneBy({ id: createUserDto.roleId }),
      this.checkEmailExists(createUserDto.email)
    ])
    if (!role) {
      throw new NotFoundException(ROLE_MESSAGE.NOT_FOUND)
    }
    const result = await this.userRepository.save({
      ...omit(createUserDto, ['roleId']),
      password: hashString(createUserDto.password),
      role
    })
    return omit(result, ['password'])
  }

  findAll(query: PaginateQuery) {
    const page = query.page || 1
    const limit = query.limit || 10
    return paginate({ ...query, limit, page }, this.userRepository, USER_PAGINATION_CONFIG)
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id }, relations: { role: true } })
    if (!user) throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id }, relations: { role: true } })
    if (!user) throw new NotFoundException(USER_MESSAGES.NOT_FOUND)

    if (user.name === 'ADMIN') throw new ForbiddenException(AUTH_MESSAGES.PERMISSIONS_DENIED)

    const role = await this.roleRepository.findOneBy({ id: updateUserDto.roleId })
    if (!role) throw new NotFoundException(ROLE_MESSAGE.NOT_FOUND)

    if (updateUserDto.password) {
      user.password = hashString(updateUserDto.password)
    }
    const result = await this.userRepository.save({
      ...user,
      ...omit(updateUserDto, ['password']),
      role
    })
    return omit(result, ['password'])
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id }, relations: { role: true } })
    if (!user) throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
    if (user.name === 'ADMIN') throw new ForbiddenException(AUTH_MESSAGES.PERMISSIONS_DENIED)
    return await this.userRepository.remove(user)
  }
}
