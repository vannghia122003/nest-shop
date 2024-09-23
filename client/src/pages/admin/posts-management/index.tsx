import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import postApi from '@/api/post-api'
import DataTable from '@/components/data-table'
import { useTableContext } from '@/components/data-table/table-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import postColumns from '@/pages/admin/posts-management/columns'
import PATH from '@/utils/path'
import QUERY_KEY from '@/utils/query-key'

function PostsManagement() {
  const navigate = useNavigate()
  const { updatingRowId, deletingRowId, setUpdatingRowId } = useTableContext()
  const deletePostMutation = useMutation({ mutationFn: postApi.deletePost })
  const { data: postsData, refetch } = useQuery({
    queryKey: [QUERY_KEY.POSTS],
    queryFn: () => postApi.getAllPosts({ limit: -1 }),
    staleTime: 5 * 60 * 1000
  })

  useEffect(() => {
    if (updatingRowId) {
      navigate(`/dashboard/post/${updatingRowId}/update`)
      setUpdatingRowId(null)
    }
  }, [navigate, setUpdatingRowId, updatingRowId])

  const handleDeleteRow = async () => {
    if (deletingRowId) {
      await deletePostMutation.mutateAsync(deletingRowId)
      await refetch()
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Posts ({postsData?.data.meta.totalItems})
          </h2>
          <p className="mb-4 text-muted-foreground">Manage posts</p>
        </div>
        <Button asChild>
          <Link to={PATH.DASHBOARD_CREATE_POST}>Add new</Link>
        </Button>
      </div>
      <Card className="p-6">
        <DataTable
          columns={postColumns}
          data={postsData?.data.data || []}
          onDeleteRow={handleDeleteRow}
          searchColumn="title"
        />
      </Card>
    </>
  )
}

export default PostsManagement
