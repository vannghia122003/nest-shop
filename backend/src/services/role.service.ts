import { StatusCodes } from 'http-status-codes'
import { ObjectId, WithId } from 'mongodb'
import db from '~/config/database'
import { Roles, RolesId } from '~/constants/enums'
import Role from '~/models/Role'
import { RoleDocument } from '~/types/document'
import { UpdateRoleReqBody } from '~/types/role'
import { ApiError } from '~/utils/ApiError'

const roleService = {
  async checkAndCreateRole(name: string) {
    const role = await db.roles.findOneAndUpdate(
      { name: name.toLowerCase() },
      {
        $setOnInsert: new Role({ name: name.toLowerCase() })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return role as WithId<Role>
  },
  async getRoles() {
    const result = await db.roles
      .aggregate<RoleDocument>([
        {
          $lookup: {
            from: 'permissions',
            localField: 'permissions',
            foreignField: '_id',
            as: 'permissions'
          }
        }
      ])
      .toArray()
    return result
  },

  async getRoleById(role_id: string) {
    const result = await db.roles
      .aggregate<RoleDocument>([
        {
          $match: {
            _id: new ObjectId(role_id)
          }
        },
        {
          $lookup: {
            from: 'permissions',
            localField: 'permissions',
            foreignField: '_id',
            as: 'permissions'
          }
        }
      ])
      .toArray()
    return result[0]
  },

  async updateRole(role_id: string, body: UpdateRoleReqBody) {
    const permissionIds = body.permissions.map((permission) => new ObjectId(permission))
    const result = await db.roles.findOneAndUpdate(
      { _id: new ObjectId(role_id) },
      {
        $set: {
          name: body.name,
          permissions: permissionIds
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return result
  },
  async deleteRole(role_id: string) {
    if ([RolesId.SuperAdmin, RolesId.User].includes(role_id)) {
      throw new ApiError({
        status: StatusCodes.FORBIDDEN,
        message: 'Không được phép xoá role này'
      })
    }
    const result = await db.roles.findOneAndDelete({ _id: new ObjectId(role_id) })
    return result
  }
}

export default roleService
