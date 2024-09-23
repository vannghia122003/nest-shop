import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnprocessableEntityException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import capitalize from 'lodash/capitalize'
import omit from 'lodash/omit'
import { paginate, PaginateQuery } from 'nestjs-paginate'
import { Repository } from 'typeorm'
import { z } from 'zod'
import { DefaultRole } from '../common/types/enum'
import { hashString } from '../common/utils/bcrypt'
import { AUTH_MESSAGES, ROLE_MESSAGE } from '../common/utils/constants'
import { usersData } from '../common/utils/data/faker'
import { Config } from '../config/env.config'
import { Permission } from '../permission/entities/permission.entity'
import { User } from '../user/entities/user.entity'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Role, ROLE_PAGINATION_CONFIG } from './entities/role.entity'

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    private configService: ConfigService<Config, true>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>
  ) {}

  async checkRoleNameExists(roleName: string) {
    try {
      const schema = z.string().refine(
        async (name) => {
          return !(await this.roleRepository.findOneBy({ name }))
        },
        { message: 'Role already exists', path: ['name'] }
      )
      await schema.parseAsync(roleName)
    } catch (error) {
      throw new UnprocessableEntityException(error)
    }
  }

  async create(createRoleDto: CreateRoleDto) {
    await this.checkRoleNameExists(createRoleDto.name)
    return this.roleRepository.save(createRoleDto)
  }

  findAll(query: PaginateQuery) {
    const page = query.page || 1
    const limit = query.limit || 10
    return paginate({ ...query, limit, page }, this.roleRepository, ROLE_PAGINATION_CONFIG)
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: { permissions: true }
    })
    if (!role) throw new NotFoundException(ROLE_MESSAGE.NOT_FOUND)
    return role
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOneBy({ id })
    if (!role) throw new NotFoundException(ROLE_MESSAGE.NOT_FOUND)

    if (role.name === DefaultRole.ADMIN) {
      throw new ForbiddenException(AUTH_MESSAGES.ACCESS_DENIED)
    }

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      await this.checkRoleNameExists(updateRoleDto.name)
    }

    if (updateRoleDto.permissionIds) {
      if (updateRoleDto.permissionIds.length === 0) {
        role.permissions = []
      } else {
        role.permissions = await this.permissionRepository.find({
          where: updateRoleDto.permissionIds.map((permissionId) => ({ id: permissionId }))
        })
      }
    }
    return await this.roleRepository.save({ ...role, ...omit(updateRoleDto, ['permissionIds']) })
  }

  async remove(id: number) {
    const role = await this.roleRepository.findOneBy({ id })
    if (!role) throw new NotFoundException(ROLE_MESSAGE.NOT_FOUND)
    if (role.name === DefaultRole.ADMIN || role.name === DefaultRole.CUSTOMER) {
      throw new ForbiddenException(AUTH_MESSAGES.ACCESS_DENIED)
    }
    return await this.roleRepository.remove(role)
  }

  async onModuleInit() {
    const isInitData = this.configService.get('INIT_DATA')
    if (isInitData) {
      await this.roleRepository.insert([
        { name: DefaultRole.ADMIN, description: 'Administrator' },
        { name: DefaultRole.CUSTOMER, description: 'Customer' }
      ])
      const adminRole = await this.roleRepository.findOneBy({ name: DefaultRole.ADMIN })
      if (adminRole) {
        await this.userRepository.insert({
          name: capitalize(DefaultRole.ADMIN),
          email: this.configService.get('ADMIN_EMAIL'),
          password: hashString(this.configService.get('ADMIN_PASSWORD')),
          isActive: true,
          role: adminRole
        })
      }
      await this.userRepository.insert(usersData)
    }
  }
}
