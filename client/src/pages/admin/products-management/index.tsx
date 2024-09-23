import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'

import { productApi } from '@/api'
import DataTable from '@/components/data-table'
import { useTableContext } from '@/components/data-table/table-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import productColumns from '@/pages/admin/products-management/columns'
import PATH from '@/utils/path'
import QUERY_KEY from '@/utils/query-key'
import { useEffect } from 'react'

function ProductsManagement() {
  const navigate = useNavigate()
  const { updatingRowId, deletingRowId, setUpdatingRowId } = useTableContext()
  const deleteProductMutation = useMutation({ mutationFn: productApi.deleteProduct })
  const { data: productsData, refetch } = useQuery({
    queryKey: [QUERY_KEY.PRODUCTS],
    queryFn: () => productApi.getAllProducts({ limit: -1 }),
    staleTime: 5 * 60 * 1000
  })

  useEffect(() => {
    if (updatingRowId) {
      navigate(`/dashboard/product/${updatingRowId}/update`)
      setUpdatingRowId(null)
    }
  }, [navigate, setUpdatingRowId, updatingRowId])

  const handleDeleteRow = async () => {
    if (deletingRowId) {
      await deleteProductMutation.mutateAsync(deletingRowId)
      await refetch()
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Products ({productsData?.data.meta.totalItems})
          </h2>
          <p className="mb-4 text-muted-foreground">Manage products</p>
        </div>
        <Button asChild>
          <Link to={PATH.DASHBOARD_CREATE_PRODUCT}>Add new</Link>
        </Button>
      </div>
      <Card className="p-6">
        <DataTable
          columns={productColumns}
          data={productsData?.data.data || []}
          onDeleteRow={handleDeleteRow}
          searchColumn="name"
        />
      </Card>
    </>
  )
}

export default ProductsManagement
