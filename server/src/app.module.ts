import { ForbiddenException, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import cors from 'cors'
import { AccountModule } from './account/account.module'
import { AuthModule } from './auth/auth.module'
import { CartModule } from './cart/cart.module'
import { CategoryModule } from './category/category.module'
import databaseOptions from './config/database.config'
import { Config, validate } from './config/env.config'
import { DashboardModule } from './dashboard/dashboard.module'
import { FileModule } from './file/file.module'
import { MailModule } from './mail/mail.module'
import { OrderModule } from './order/order.module'
import { PermissionModule } from './permission/permission.module'
import { PostModule } from './post/post.module'
import { ProductModule } from './product/product.module'
import { RoleModule } from './role/role.module'
import { TagModule } from './tag/tag.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', validate }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(databaseOptions),
    JwtModule.register({ global: true, signOptions: { algorithm: 'HS256' } }),
    AuthModule,
    AccountModule,
    UserModule,
    RoleModule,
    PermissionModule,
    TagModule,
    PostModule,
    CategoryModule,
    ProductModule,
    CartModule,
    OrderModule,
    MailModule,
    FileModule,
    DashboardModule
  ]
})
export class AppModule {
  constructor(private configService: ConfigService<Config, true>) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cors({
          origin: (origin, callback) => {
            if (origin === this.configService.get('CLIENT_URL')) return callback(null, true)
            return callback(new ForbiddenException(`${origin} not allowed by our CORS Policy.`))
          },
          optionsSuccessStatus: 200,
          credentials: true
        })
      )
      .exclude(
        { path: '/auth/google', method: RequestMethod.GET },
        { path: '/auth/google-redirect', method: RequestMethod.GET }
      )
      .forRoutes('*')
  }
}
