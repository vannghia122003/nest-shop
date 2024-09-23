import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { ResponseMessage } from '../common/decorators/response-message.decorator'
import { USER_MESSAGES } from '../common/utils/constants'
import { DeleteImageDto } from './dto/delete-image.dto'
import { FileService } from './file.service'

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiCreatedResponse({ type: 'string', isArray: true })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { images: { type: 'array', items: { type: 'string', format: 'binary' } } }
    }
  })
  @ResponseMessage(USER_MESSAGES.UPLOAD_IMAGE_SUCCESS)
  @Post('upload-image')
  @UseInterceptors(FilesInterceptor('images', 6))
  uploadImage(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image' })
        .addMaxSizeValidator({
          maxSize: 500 * 1024 // 500kb
        })
        .build({ errorHttpStatusCode: HttpStatus.BAD_REQUEST })
    )
    files: Express.Multer.File[]
  ) {
    return this.fileService.uploadImage(files)
  }

  @ResponseMessage(USER_MESSAGES.DELETE_IMAGE_SUCCESS)
  @Delete('delete-image')
  deleteImage(@Body() deleteImageDto: DeleteImageDto) {
    return this.fileService.deleteImage(deleteImageDto)
  }
}
