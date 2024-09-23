import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary } from 'cloudinary'
import { Config } from '../config/env.config'
import { FileController } from './file.controller'
import { FileService } from './file.service'

@Module({
  controllers: [FileController],
  providers: [
    FileService,
    {
      provide: 'CLOUDINARY',
      useFactory: async (configService: ConfigService<Config, true>) => {
        return cloudinary.config({
          cloud_name: configService.get('CLOUDINARY_NAME'),
          api_key: configService.get('CLOUDINARY_API_KEY'),
          api_secret: configService.get('CLOUDINARY_API_SECRET')
        })
      },
      inject: [ConfigService]
    }
  ]
})
export class FileModule {}
