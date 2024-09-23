import { useMutation, useQuery } from '@tanstack/react-query'

import { roleApi } from '@/api'
import DataTable from '@/components/data-table'
import { useTableContext } from '@/components/data-table/table-provider'
import { Card } from '@/components/ui/card'
import roleColumns from '@/pages/admin/roles-management/columns'
import QUERY_KEY from '@/utils/query-key'
import RoleForm from '@/pages/admin/roles-management/role-form'

function RolesManagement() {
  const { deletingRowId } = useTableContext()
  const deleteUserMutation = useMutation({ mutationFn: roleApi.deleteRole })
  const { data: rolesData, refetch } = useQuery({
    queryKey: [QUERY_KEY.ROLES],
    queryFn: () => roleApi.getAllRoles({ limit: '-1' }),
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
            Roles ({rolesData?.data.meta.totalItems})
          </h2>
          <p className="mb-4 text-muted-foreground">Manage roles</p>
        </div>
        <RoleForm />
      </div>
      <Card className="p-6">
        <DataTable
          columns={roleColumns}
          data={rolesData?.data.data || []}
          onDeleteRow={handleDeleteRow}
          searchColumn="name"
        />
      </Card>
    </>
  )
}
export default RolesManagement
