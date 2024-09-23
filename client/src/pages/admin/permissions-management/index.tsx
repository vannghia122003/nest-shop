import { useMutation, useQuery } from '@tanstack/react-query'

import permissionApi from '@/api/permission-api'
import DataTable from '@/components/data-table'
import { useTableContext } from '@/components/data-table/table-provider'
import { Card } from '@/components/ui/card'
import permissionColumns from '@/pages/admin/permissions-management/columns'
import PermissionForm from '@/pages/admin/permissions-management/permission-form'
import QUERY_KEY from '@/utils/query-key'

function PermissionsManagement() {
  const { deletingRowId } = useTableContext()
  const deleteUserMutation = useMutation({ mutationFn: permissionApi.deletePermission })
  const { data: permissionsData, refetch } = useQuery({
    queryKey: [QUERY_KEY.PERMISSIONS],
    queryFn: () => permissionApi.getAllPermissions({ limit: -1 }),
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
            Permissions ({permissionsData?.data.meta.totalItems})
          </h2>
          <p className="mb-4 text-muted-foreground">Manage permissions</p>
        </div>
        <PermissionForm />
      </div>
      <Card className="p-6">
        <DataTable
          columns={permissionColumns}
          data={permissionsData?.data.data || []}
          onDeleteRow={handleDeleteRow}
          searchColumn="module"
        />
      </Card>
    </>
  )
}
export default PermissionsManagement
