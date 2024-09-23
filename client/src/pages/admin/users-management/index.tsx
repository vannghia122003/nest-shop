import { useMutation, useQuery } from '@tanstack/react-query'

import userApi from '@/api/user-api'
import DataTable from '@/components/data-table'
import { useTableContext } from '@/components/data-table/table-provider'
import { Card } from '@/components/ui/card'
import columnsUser from '@/pages/admin/users-management/columns'
import CreateUserForm from '@/pages/admin/users-management/create-user-form'
import UpdateUserForm from '@/pages/admin/users-management/update-user-form'
import QUERY_KEY from '@/utils/query-key'

function UsersManagement() {
  const { deletingRowId } = useTableContext()
  const deleteUserMutation = useMutation({ mutationFn: userApi.deleteUser })
  const { data: usersData, refetch } = useQuery({
    queryKey: [QUERY_KEY.USERS],
    queryFn: () => userApi.getAllUsers({ limit: '-1' }),
    staleTime: 5 * 60 * 1000
  })

  const handleDeleteRow = async () => {
    if (deletingRowId) {
      await deleteUserMutation.mutateAsync(deletingRowId)
      await refetch()
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Users ({usersData?.data.meta.totalItems})
          </h2>
          <p className="mb-4 text-muted-foreground">Manage users</p>
        </div>
        <CreateUserForm />
      </div>
      <Card className="p-6">
        <DataTable
          columns={columnsUser}
          data={usersData?.data.data || []}
          onDeleteRow={handleDeleteRow}
          searchColumn="name"
        />
        <UpdateUserForm />
      </Card>
    </>
  )
}

export default UsersManagement
