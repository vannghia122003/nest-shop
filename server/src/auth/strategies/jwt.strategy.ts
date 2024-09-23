import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { IJwtDecodedNotPermission } from '../../common/types/interface'
import { USER_MESSAGES } from '../../common/utils/constants'
import { Config } from '../../config/env.config'
import { Role } from '../../role/entities/role.entity'
import { User } from '../../user/entities/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService<Config, true>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET')
    })
  }

  // Function return jwt decoded to function handleRequest (jwt-auth.guard.ts)
  async validate(payload: IJwtDecodedNotPermission) {
    const user = await this.userRepository.findOneBy({ id: payload.userId })
    if (!user) throw new NotFoundException(USER_MESSAGES.NOT_FOUND)
    const role = await this.roleRepository.findOne({
      where: { id: payload.role.id },
      relations: { permissions: true }
    })

    return { ...payload, isActive: user.isActive, permissions: role?.permissions }
  }
}
