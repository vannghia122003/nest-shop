import { Request } from 'express'
import formidable, { File } from 'formidable'
import fs from 'fs'
import { StatusCodes } from 'http-status-codes'
import path from 'path'
import { ApiError } from './ApiError'

export const UPLOAD_FOLDER_PATH = path.resolve('src', 'public', 'uploads', 'temp')

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_FOLDER_PATH)) {
    fs.mkdirSync(UPLOAD_FOLDER_PATH, {
      recursive: true // Tự động tạo các thư mục cha nếu chúng không tồn tại.
    })
  }
}

export const handleUploadImage = (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_FOLDER_PATH,
    maxFiles: 6,
    keepExtensions: true,
    maxFileSize: 500 * 1024, // 500kb
    maxTotalFileSize: 500 * 1024 * 6,
    filter: ({ name, originalFilename, mimetype }) => {
      // ko gửi gì lên thì sẽ ko chạy vào filter
      const isValid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (name !== 'image') {
        form.emit(
          'error' as any,
          new ApiError({
            status: StatusCodes.BAD_REQUEST,
            message: 'Vui lòng gửi 1 file ảnh với key là image'
          }) as any
        )
      }
      if (!mimetype?.includes('image/')) {
        form.emit(
          'error' as any,
          new ApiError({
            status: StatusCodes.BAD_REQUEST,
            message: 'Định dạng file không hợp lệ'
          }) as any
        )
      }
      return isValid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.image) {
        // nếu ko gửi gì lên thì `files` là object rỗng
        return reject(
          new ApiError({
            status: StatusCodes.BAD_REQUEST,
            message: 'Vui lòng tải lên một file ảnh'
          })
        )
      }

      // console.log('fields: ', fields)
      // console.log('files: ', files)
      resolve(files.image)
    })
  })
}

export const removeFileExtension = (fileName: string) => {
  // Sử dụng hàm indexOf để tìm vị trí của ký tự '.'
  const dotIndex = fileName.lastIndexOf('.')

  // Kiểm tra xem ký tự '.' có tồn tại trong chuỗi hay không
  if (dotIndex !== -1) {
    // Sử dụng hàm slice để cắt bỏ phần mở rộng ('.png')
    return fileName.slice(0, dotIndex)
  } else {
    // Nếu không tìm thấy '.', trả về tên tệp ban đầu
    return fileName
  }
}
