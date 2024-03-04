/* eslint-disable jsx-a11y/label-has-associated-control */
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Accordion, Modal } from 'flowbite-react'
import { Dictionary, groupBy } from 'lodash'
import { ChangeEvent, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import roleApi from '~/apis/role.api'
import Button from '~/components/Button'
import Input from '~/components/Input'
import QUERY_KEYS from '~/constants/keys'
import { Permission } from '~/types/role.type'

interface Props {
  openModal: boolean
  onCloseModal: () => void
  updatingRoleId: string
}

const roleSchema = yup.object({
  name: yup.string().required('Nhập tên role'),
  permissions: yup.array().of(yup.string().defined()).required()
})
type FormData = yup.InferType<typeof roleSchema>

function RoleModal({ openModal, onCloseModal, updatingRoleId }: Props) {
  const queryClient = useQueryClient()
  const form = useForm<FormData>({
    resolver: yupResolver(roleSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: { name: '', permissions: [] }
  })
  const { data: roleData } = useQuery({
    queryKey: [QUERY_KEYS.ROLE_DETAIL],
    queryFn: () => roleApi.getRole(updatingRoleId),
    enabled: Boolean(updatingRoleId)
  })
  const { data: permissionsData } = useQuery({
    queryKey: [QUERY_KEYS.PERMISSIONS],
    queryFn: () => roleApi.getPermissions(),
    enabled: Boolean(updatingRoleId)
  })
  const updateRoleMutation = useMutation({ mutationFn: roleApi.updateRole })
  const transformedPermissions = groupBy<Permission>(
    permissionsData?.result,
    'module'
  ) as unknown as Dictionary<Permission[]> // chuyển đổi data từ api
  const permissions = form.watch('permissions') // lấy permissions từ form

  useEffect(() => {
    if (roleData) {
      const permissions = roleData.result.permissions.map((permission) => permission._id)
      form.setValue('name', roleData.result.name)
      form.setValue('permissions', permissions)
    }
  }, [form, roleData])

  const renderMethodColor = (method: string) => {
    if (method === 'POST') return 'text-yellow-500'
    if (method === 'GET') return 'text-green-500'
    if (method === 'PUT') return 'text-blue-500'
    if (method === 'PATCH') return 'text-purple-500'
    if (method === 'DELETE') return 'text-red-500'
    return ''
  }

  const handleTogglePermission = (permissionId: string) => (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    const permissions = form.getValues('permissions') || []
    if (checked && !permissions.includes(permissionId)) {
      form.setValue('permissions', [...permissions, permissionId])
    }
    if (!checked && permissions.includes(permissionId)) {
      form.setValue(
        'permissions',
        permissions.filter((permission_id) => permission_id !== permissionId)
      )
    }
  }

  const handleSubmit = form.handleSubmit((data: FormData) => {
    updateRoleMutation.mutate(
      { role_id: updatingRoleId, data },
      {
        onSuccess: (data) => {
          toast.success(data.message)
          onCloseModal()
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROLES] })
        }
      }
    )
  })

  return (
    <Modal dismissible show={openModal} onClose={onCloseModal} size="3xl" className="z-999">
      <Modal.Header>Cập nhật role</Modal.Header>
      <Modal.Body>
        <form
          className="text-secondary flex gap-2 flex-col"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <div>
            <div className="mb-1">Tên role</div>
            <Input name="name" formObj={form} />
          </div>
          <div>
            <div className="mb-1">Quyền truy cập</div>
            <Accordion collapseAll>
              {Object.entries(transformedPermissions).map(([key, value]) => (
                <Accordion.Panel key={key}>
                  <Accordion.Title>{key.toUpperCase()}</Accordion.Title>
                  <Accordion.Content>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
                      {value.map((permission) => (
                        <div className="p-4 border border-gray-200 rounded-md" key={permission._id}>
                          <p className="mb-2 font-bold">{permission.description}</p>
                          <div className="flex items-center gap-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                id={permission._id}
                                checked={permissions?.includes(permission._id)}
                                onChange={handleTogglePermission(permission._id)}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/40 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                            </label>
                            <label htmlFor={permission._id} className="cursor-pointer">
                              <p className={`font-bold ${renderMethodColor(permission.method)}`}>
                                {permission.method}
                              </p>
                              <p>{permission.resource}</p>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Accordion.Content>
                </Accordion.Panel>
              ))}
            </Accordion>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={updateRoleMutation.isPending}
          isLoading={updateRoleMutation.isPending}
          onClick={handleSubmit}
          className="bg-secondary text-white py-3 px-4 rounded-md hover:opacity-80"
        >
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
export default RoleModal
