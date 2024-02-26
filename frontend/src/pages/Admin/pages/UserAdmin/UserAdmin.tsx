import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Button as ButtonFlowBite,
  Flowbite,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow
} from 'flowbite-react'
import { useState } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { SingleValue } from 'react-select'
import roleApi from '~/apis/role.api'
import userApi from '~/apis/user.api'
import ConfirmModal from '~/components/ConfirmModal'
import Select from '~/components/Select'
import { customTheme } from '~/types/custom.type'
import { UserListQuery } from '~/types/user.type'

function UserAdmin() {
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false)
  const [deletingUserId, setDeletingUserId] = useState('')
  const [userListQuery, setUserListQuery] = useState<UserListQuery>({
    limit: 5,
    page: 1
  })
  const { data: usersData, refetch } = useQuery({
    queryKey: ['user', userListQuery],
    queryFn: () => userApi.getUsers(userListQuery)
  })
  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: roleApi.getRoles
  })
  const updateUserMutation = useMutation({ mutationFn: userApi.updateUser })
  const deleteUserMutation = useMutation({ mutationFn: userApi.deleteUser })
  const roleOptions = rolesData?.result.map((role) => ({ value: role._id, label: role.name })) || []

  const handlePageChange = (page: number) => setUserListQuery({ ...userListQuery, page })

  const handleCloseModalConfirm = () => {
    if (deletingUserId) setDeletingUserId('')
    setOpenModalConfirm(false)
  }

  const handleDeleteUser = (userId: string) => {
    setOpenModalConfirm(true)
    setDeletingUserId(userId)
  }

  const handleConfirmDeleteUser = () => {
    if (deletingUserId) {
      deleteUserMutation.mutate(deletingUserId, {
        onSuccess: () => {
          setOpenModalConfirm(false)
          setDeletingUserId('')
          refetch()
        }
      })
    }
  }

  const handleChangeRole =
    (user_id: string) => (option: SingleValue<{ label: string; value: string }>) => {
      updateUserMutation.mutate(
        { user_id, data: { role_id: option?.value } },
        {
          onSuccess: () => {
            refetch()
          }
        }
      )
    }

  return (
    <div className="p-20 bg-white overflow-x-auto shadow">
      <div className="min-w-[900px]">
        <div className="py-4 flex items-center justify-between">
          <h2 className="text-secondary text-3xl">Người dùng</h2>
        </div>
        <Flowbite theme={{ theme: customTheme }}>
          <Table hoverable className="border border-gray-300">
            <TableHead>
              <TableHeadCell>Tên</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Địa chỉ</TableHeadCell>
              <TableHeadCell>Vai trò</TableHeadCell>
              <TableHeadCell>Thao tác</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {usersData &&
                usersData.result.map((user) => (
                  <TableRow className="bg-white" key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>
                      <Select
                        menuHeight={150}
                        isSearchable={false}
                        value={{
                          value: user.role._id,
                          label: user.role.name
                        }}
                        options={roleOptions}
                        onChange={handleChangeRole(user._id)}
                        isDisabled={updateUserMutation.isPending}
                      />
                    </TableCell>
                    <TableCell>
                      <ButtonFlowBite
                        color="red"
                        size="xs"
                        title="Xoá"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <span className="text-lg">
                          <FaTrashAlt />
                        </span>
                      </ButtonFlowBite>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Flowbite>
        <div className="bg-white border-t p-4 flex justify-center">
          <Pagination
            layout="pagination"
            currentPage={userListQuery.page as number}
            totalPages={usersData?.total_pages || 0}
            onPageChange={handlePageChange}
            previousLabel=""
            nextLabel=""
            showIcons
          />
        </div>
      </div>
      <ConfirmModal
        description="Bạn có chắc chắn muốn xóa người dùng này không?"
        openModal={openModalConfirm}
        onCloseModal={handleCloseModalConfirm}
        onConfirm={handleConfirmDeleteUser}
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  )
}
export default UserAdmin
