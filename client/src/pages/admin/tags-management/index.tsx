import { useMutation, useQuery } from '@tanstack/react-query'

import { tagApi } from '@/api'
import DataTable from '@/components/data-table'
import { useTableContext } from '@/components/data-table/table-provider'
import { Card } from '@/components/ui/card'
import tagColumns from '@/pages/admin/tags-management/columns'
import TagForm from '@/pages/admin/tags-management/tag-form'
import QUERY_KEY from '@/utils/query-key'

function TagsManagement() {
  const { deletingRowId } = useTableContext()
  const deleteTagMutation = useMutation({ mutationFn: tagApi.deleteTag })
  const { data: tagsData, refetch } = useQuery({
    queryKey: [QUERY_KEY.TAGS],
    queryFn: () => tagApi.getAllTags({ limit: -1 }),
    staleTime: 5 * 60 * 1000
  })

  const handleDeleteRow = async () => {
    if (deletingRowId) {
      await deleteTagMutation.mutateAsync(deletingRowId)
      await refetch()
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Tags ({tagsData?.data.meta.totalItems})
          </h2>
          <p className="mb-4 text-muted-foreground">Manage tags</p>
        </div>
        <TagForm />
      </div>
      <Card className="p-6">
        <DataTable
          columns={tagColumns}
          data={tagsData?.data.data || []}
          onDeleteRow={handleDeleteRow}
          searchColumn="name"
        />
      </Card>
    </>
  )
}
export default TagsManagement
