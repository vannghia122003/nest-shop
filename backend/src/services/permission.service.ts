import db from '~/config/database'
import Permission from '~/models/Permission'
import { CreatePermissionReqBody } from '~/types/permission'

const permissionService = {
  async createPermission(data: CreatePermissionReqBody) {
    const { resource, method, module, description } = data
    const result = await db.permissions.insertOne(
      new Permission({ resource, method: method.toUpperCase(), module, description })
    )
    return await db.permissions.findOne({ _id: result.insertedId })
  },
  getPermissions() {
    return db.permissions.find().sort({ module: 1 }).toArray()
  }
}

export default permissionService
