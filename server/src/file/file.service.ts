import { HttpException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import { Config } from '../config/env.config'
import { DeleteImageDto } from './dto/delete-image.dto'

@Injectable()
export class FileService {
  constructor(private configService: ConfigService<Config, true>) {}

  private uploadToCloudinary(buffer: Buffer) {
    return new Promise<UploadApiErrorResponse | UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: this.configService.get('UPLOAD_IMAGE_FOLDER'),
          type: 'upload',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) return reject(error)
          if (result) resolve(result)
        }
      )
      uploadStream.end(buffer)
    })
  }

  private deleteFromCloudinary = (publicIds: string[]): Promise<{ deleted: string }> => {
    return new Promise((resolve, reject) => {
      cloudinary.api.delete_resources(
        publicIds,
        { type: 'upload', resource_type: 'image' },
        (err, result) => {
          if (err) return reject(err)
          resolve(result)
        }
      )
    })
  }

  async uploadImage(files: Express.Multer.File[]) {
    const result = await Promise.all(
      files.map(async (file) => {
        const res = await this.uploadToCloudinary(file.buffer)
        return res.secure_url
      })
    )
    return result
  }

  async deleteImage(deleteImageDto: DeleteImageDto) {
    try {
      const publicIds = deleteImageDto.imageIds.map(
        (id) => `${this.configService.get('UPLOAD_IMAGE_FOLDER')}/${id}`
      )
      const res = await this.deleteFromCloudinary(publicIds)
      return res.deleted
    } catch (error) {
      throw new HttpException(error.message, error.http_code)
    }
  }
}
