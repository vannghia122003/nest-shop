import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { paginate, PaginateQuery } from 'nestjs-paginate'
import { Repository } from 'typeorm'
import { PERMISSION_MESSAGES } from '../common/utils/constants'
import permissionsData from '../common/utils/data/permission-data'
import { Config } from '../config/env.config'
import { CreatePermissionDto } from './dto/create-permission.dto'
import { UpdatePermissionDto } from './dto/update-permission.dto'
import { Permission, PERMISSION_PAGINATION_CONFIG } from './entities/permission.entity'

@Injectable()
export class PermissionService implements OnModuleInit {
  constructor(
    private configService: ConfigService<Config, true>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    return this.permissionRepository.save(createPermissionDto)
  }

  findAll(query: PaginateQuery) {
    const page = query.page || 1
    const limit = query.limit || 10
    return paginate(
      { ...query, limit, page },
      this.permissionRepository,
      PERMISSION_PAGINATION_CONFIG
    )
  }

  async findOne(id: number) {
    const permission = await this.permissionRepository.findOneBy({ id })
    if (!permission) throw new NotFoundException(PERMISSION_MESSAGES.NOT_FOUND)
    return permission
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepository.findOneBy({ id })
    if (!permission) throw new NotFoundException(PERMISSION_MESSAGES.NOT_FOUND)
    return await this.permissionRepository.save({ ...permission, ...updatePermissionDto })
  }

  async remove(id: number) {
    const permission = await this.permissionRepository.findOneBy({ id })
    if (!permission) throw new NotFoundException(PERMISSION_MESSAGES.NOT_FOUND)
    return await this.permissionRepository.remove(permission)
  }

  async onModuleInit() {
    const isInitData = this.configService.get('INIT_DATA')
    if (isInitData) {
      await this.permissionRepository.insert(permissionsData)
    }
  }
}
