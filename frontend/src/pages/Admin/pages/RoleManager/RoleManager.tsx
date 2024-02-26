import Button from '~/components/Button'
import Input from '~/components/Input'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import roleApi from '~/apis/role.api'
import { toast } from 'react-toastify'
import { isUnprocessableEntity } from '~/utils/errors'
import { ErrorResponse } from '~/types/response.type'
import { customTheme } from '~/types/custom.type'
import { Button as ButtonFlowBite, Flowbite, Table } from 'flowbite-react'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'
import { convertISOString } from '~/utils/helpers'
import ConfirmModal from '~/components/ConfirmModal'
import { useState } from 'react'
import RoleModal from './RoleModal'
import config from '~/constants/config'

const roleSchema = yup.object({
  name: yup.string().required('Nhập tên role')
})
type FormData = yup.InferType<typeof roleSchema>

function RoleManager() {
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState(false)
  const [deletingRoleId, setDeletingRoleId] = useState('')
  const [updatingRoleId, setUpdatingRoleId] = useState('')
  const form = useForm<FormData>({
    resolver: yupResolver(roleSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })
  const { data: rolesData, refetch } = useQuery({ queryKey: ['roles'], queryFn: roleApi.getRoles })
  const createRoleMutation = useMutation({ mutationFn: roleApi.createRole })
  const deleteRoleMutation = useMutation({ mutationFn: roleApi.deleteRole })

  const handleSubmit = form.handleSubmit((data: FormData) => {
    createRoleMutation.mutate(data, {
      onSuccess: (data) => {
        toast.success(data.message)
        refetch()
        form.reset()
      },
      onError: (error) => {
        if (isUnprocessableEntity<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              form.setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  const handleDeleteRole = (roleId: string) => {
    setOpenModalConfirm(true)
    setDeletingRoleId(roleId)
  }
  const handleConfirmDeleteRole = () => {
    if (deletingRoleId) {
      deleteRoleMutation.mutate(deletingRoleId, {
        onSuccess: () => {
          setOpenModalConfirm(false)
          setDeletingRoleId('')
          refetch()
        }
      })
    }
  }
  const handleCloseModal = () => {
    if (updatingRoleId) setUpdatingRoleId('')
    setOpenModal(false)
  }
  const handleUpdateRole = (roleId: string) => {
    setOpenModal(true)
    setUpdatingRoleId(roleId)
  }

  return (
    <div className="p-8 bg-white shadow">
      <h2 className="text-secondary text-3xl mb-4">Thêm role</h2>
      <form
        className="w-[500px] max-w-full flex flex-col xs:flex-row gap-0 xs:gap-4 mb-4"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <div className="flex gap-4">
          <div className="mt-3">Tên</div>
          <Input formObj={form} name="name" className="w-full" placeholder="Nhập tên role..." />
        </div>
        <div className="flex justify-end">
          <div>
            <Button
              isLoading={createRoleMutation.isPending}
              disabled={createRoleMutation.isPending}
              className="bg-secondary text-white px-4 py-3 rounded-md hover:opacity-80 font-bold"
            >
              Thêm
            </Button>
          </div>
        </div>
      </form>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <Flowbite theme={{ theme: customTheme }}>
            <Table hoverable className="border border-gray-300">
              <Table.Head>
                <Table.HeadCell>Role</Table.HeadCell>
                <Table.HeadCell>Thời gian tạo</Table.HeadCell>
                <Table.HeadCell>Thao tác</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {rolesData &&
                  rolesData.result.map((role) => (
                    <Table.Row className="bg-white" key={role._id}>
                      <Table.Cell>{role.name}</Table.Cell>
                      <Table.Cell>{convertISOString(role.created_at)}</Table.Cell>

                      <Table.Cell>
                        {role._id !== config.super_admin_role_id && (
                          <div className="flex gap-2">
                            <ButtonFlowBite
                              color="cyan"
                              size="xs"
                              onClick={() => handleUpdateRole(role._id)}
                              title="Chỉnh sửa"
                            >
                              <span className="text-lg">
                                <FaEdit />
                              </span>
                            </ButtonFlowBite>
                            <ButtonFlowBite
                              color="red"
                              size="xs"
                              onClick={() => handleDeleteRole(role._id)}
                              title="Xoá"
                            >
                              <span className="text-lg">
                                <FaTrashAlt />
                              </span>
                            </ButtonFlowBite>
                          </div>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </Flowbite>
        </div>
      </div>
      <ConfirmModal
        description="Bạn có chắc chắn muốn xóa role này không?"
        openModal={openModalConfirm}
        onCloseModal={() => {
          setOpenModalConfirm(false)
          setDeletingRoleId('')
        }}
        onConfirm={handleConfirmDeleteRole}
        isLoading={deleteRoleMutation.isPending}
      />
      <RoleModal
        openModal={openModal}
        onCloseModal={handleCloseModal}
        updatingRoleId={updatingRoleId}
      />
    </div>
  )
}
export default RoleManager
