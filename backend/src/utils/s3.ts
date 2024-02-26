import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import env from '~/config/environment'
import fs from 'fs'

const s3 = new S3({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
  }
})

export const uploadFileToS3 = ({
  filename,
  filepath,
  contentType
}: {
  filename: string
  filepath: string
  contentType: string
}) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: 'ecommerce-vannghia',
      Key: filename,
      Body: fs.readFileSync(filepath),
      ContentType: contentType
    },
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 5 // optional size of each part, in bytes, at least 5MB
  })
  return parallelUploads3.done()
}
