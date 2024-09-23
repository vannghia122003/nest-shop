import { TypeOrmModuleOptions } from '@nestjs/typeorm'

const databaseOptions: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'db/prod.db',
  synchronize: true,
  autoLoadEntities: true,
  retryAttempts: 3
}

export default databaseOptions
