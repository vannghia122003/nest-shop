import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import { Request } from 'express'
import { unlink } from 'fs/promises'
import { StatusCodes } from 'http-status-codes'
import { omit } from 'lodash'
import pick from 'lodash/pick'
import { ObjectId } from 'mongodb'
import path from 'path'
import sharp from 'sharp'
import db from '~/config/database'
import { AUTH_MESSAGES, USER_MESSAGES } from '~/constants/messages'
import { UserDocument } from '~/types/document'
import { UpdateMeReqBody, UpdateMeType, UpdateUserReqBody, UpdateUserType } from '~/types/user'
import { ApiError } from '~/utils/ApiError'
import { hashPassword } from '~/utils/bcrypt'
import { handleUploadImage, removeFileExtension } from '~/utils/file'
import { uploadFileToS3 } from '~/utils/s3'

const userService = {
  async getUserByEmail(email: string) {
    const user = await db.users
      .aggregate<UserDocument>([
        {
          $match: {
            email
          }
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'role_id',
            foreignField: '_id',
            as: 'role'
          }
        },
        {
          $unwind: {
            path: '$role'
          }
        },
        {
          $project: {
            role_id: 0,
            role: {
              permissions: 0,
              created_at: 0,
              updated_at: 0
            }
          }
        }
      ])
      .toArray()
    return user[0]
  },
  async getUserById(user_id: string) {
    const user = await db.users
      .aggregate<UserDocument>([
        {
          $match: {
            _id: new ObjectId(user_id)
          }
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'role_id',
            foreignField: '_id',
            as: 'role'
          }
        },
        {
          $unwind: {
            path: '$role'
          }
        },
        {
          $project: {
            role_id: 0,
            role: {
              permissions: 0,
              created_at: 0,
              updated_at: 0
            }
          }
        }
      ])
      .toArray()
    return user[0]
  },

  async updateMe(user_id: string, body: UpdateMeReqBody) {
    const updateBody = pick(body, [
      'address',
      'avatar',
      'date_of_birth',
      'name',
      'phone'
    ]) as UpdateMeType
    if (updateBody.date_of_birth) {
      updateBody.date_of_birth = new Date(updateBody.date_of_birth)
    }

    await db.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...updateBody
        },
        $currentDate: {
          updated_at: true
        }
      }
    )

    const user = await this.getUserById(user_id)
    return user
  },

  async changePassword(user_id: string, new_password: string) {
    await db.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(new_password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: USER_MESSAGES.CHANGE_PASSWORD_SUCCESS
    }
  },

  async getUsers({ limit, page }: { limit: number; page: number }) {
    const [users, totalDocuments] = await Promise.all([
      db.users
        .aggregate<UserDocument>([
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          },
          {
            $lookup: {
              from: 'roles',
              localField: 'role_id',
              foreignField: '_id',
              as: 'role'
            }
          },
          {
            $unwind: {
              path: '$role'
            }
          },
          {
            $project: {
              role_id: 0,
              password: 0,
              email_verify_token: 0,
              forgot_password_token: 0,
              role: {
                created_at: 0,
                updated_at: 0
              }
            }
          }
        ])
        .toArray(),
      db.users.countDocuments()
    ])

    return { users, totalDocuments }
  },

  async updateUserById(user_id: string, body: UpdateUserReqBody) {
    if (user_id === '657becf800560d5cde6a9c53') {
      throw new ApiError({
        status: StatusCodes.FORBIDDEN,
        message: 'Access denied'
      })
    }
    const updateBody = pick(body, [
      'address',
      'avatar',
      'date_of_birth',
      'name',
      'phone',
      'role_id'
    ]) as UpdateUserType
    if (updateBody.date_of_birth) {
      updateBody.date_of_birth = new Date(updateBody.date_of_birth)
    }
    if (updateBody.role_id) {
      updateBody.role_id = new ObjectId(updateBody.role_id)
    }

    const user = await db.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...updateBody
        },
        $currentDate: {
          updated_at: true
        }
      },
      { returnDocument: 'after' }
    )
    return omit(user, ['email_verify_token', 'reset_password_token', 'password'])
  },

  async deleteUserById(user_id: string) {
    if (user_id === '657becf800560d5cde6a9c53') {
      throw new ApiError({
        status: StatusCodes.FORBIDDEN,
        message: 'Access denied'
      })
    }
    const result = await db.users.findOneAndDelete({ _id: new ObjectId(user_id) })
    return result
  },

  async handleUploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const filename = removeFileExtension(file.newFilename)
        const newFullFilename = `${filename}.jpg`
        const newFilepath = path.resolve('src', 'public', 'uploads', newFullFilename)
        await sharp(file.filepath).jpeg().toFile(newFilepath) // convert to jpeg
        const s3Result = await uploadFileToS3({
          filename: newFullFilename,
          filepath: newFilepath,
          contentType: 'image/jpeg'
        })

        await Promise.all([unlink(file.filepath), unlink(newFilepath)])

        return (s3Result as CompleteMultipartUploadCommandOutput).Location
        // return `http://localhost:4000/uploads/${newFullFilename}`
      })
    )

    return result
  }
}

export default userService
