import { useMutation, useQuery } from '@tanstack/react-query'

import { categoryApi } from '@/api'
import DataTable from '@/components/data-table'
import { useTableContext } from '@/components/data-table/table-provider'
import { Card } from '@/components/ui/card'
import CategoryForm from '@/pages/admin/categories-management/category-form'
import categoryColumns from '@/pages/admin/categories-management/columns'
import QUERY_KEY from '@/utils/query-key'

function CategoriesManagement() {
  const { deletingRowId } = useTableContext()
  const deleteCategoryMutation = useMutation({ mutationFn: categoryApi.deleteCategory })
  const { data: categoriesData, refetch } = useQuery({
    queryKey: [QUERY_KEY.CATEGORIES],
    queryFn: () => categoryApi.getAllCategories({ limit: '-1' }),
    staleTime: 5 * 60 * 1000
  })

  const handleDeleteRow = async () => {
    if (deletingRowId) {
      await deleteCategoryMutation.mutateAsync(deletingRowId)
      await refetch()
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Categories ({categoriesData?.data.meta.totalItems})
          </h2>
          <p className="mb-4 text-muted-foreground">Manage categories</p>
        </div>
        <CategoryForm />
      </div>
      <Card className="p-6">
        <DataTable
          columns={categoryColumns}
          data={categoriesData?.data.data || []}
          onDeleteRow={handleDeleteRow}
          searchColumn="name"
        />
      </Card>
    </>
  )
}
export default CategoriesManagement
