import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { tagApi } from '@/api'
import { useTableContext } from '@/components/data-table/table-provider'
import FormDialog from '@/components/form-dialog'
import FormText from '@/components/form-input/form-text'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { handleUnprocessableEntityError } from '@/utils/helper'
import QUERY_KEY from '@/utils/query-key'

const schema = z.object({
  name: z.string().min(1, { message: 'Tag name is required' }).min(2).max(50)
})
type FormData = z.infer<typeof schema>

function TagForm() {
  const queryClient = useQueryClient()
  const { updatingRowId, setUpdatingRowId } = useTableContext()
  const [open, setOpen] = useState<boolean>(false)
  const createTagMutation = useMutation({ mutationFn: tagApi.createTag })
  const updateTagMutation = useMutation({ mutationFn: tagApi.updateTag })
  const { data: tagData } = useQuery({
    queryKey: [QUERY_KEY.TAG_DETAIL, updatingRowId],
    queryFn: () => tagApi.getTagById(updatingRowId!),
    enabled: Boolean(updatingRowId)
  })
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldFocusError: false,
    defaultValues: { name: '' }
  })

  const isPending = createTagMutation.isPending || updateTagMutation.isPending

  useEffect(() => {
    form.clearErrors()
    if (tagData) {
      form.setValue('name', tagData.data.name)
    }
  }, [tagData, form])

  const handleOpenChangeDialog = (open: boolean) => {
    setOpen(open)
    form.reset()
    if (!open) {
      setUpdatingRowId(null)
    }
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      if (updatingRowId) {
        const res = await updateTagMutation.mutateAsync({ tagId: updatingRowId, body: data })
        toast.success(res.message)
        setUpdatingRowId(null)
      } else {
        const res = await createTagMutation.mutateAsync(data)
        toast.success(res.message)
        setOpen(false)
      }
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TAGS] })
      form.reset()
    } catch (error) {
      handleUnprocessableEntityError(error, form.setError)
    }
  })

  return (
    <FormDialog
      open={open || Boolean(updatingRowId)}
      title={updatingRowId ? 'Update tag' : 'Create tag'}
      description={
        updatingRowId
          ? "Update tag here. Click save when you're done."
          : "Create new tag here. Click create when you're done."
      }
      onOpenChange={handleOpenChangeDialog}
      btnTrigger={<Button>Add new</Button>}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <FormText form={form} name="name" label="Tag" placeholder="Enter tag name" />
          </div>
          <Button type="submit" className="mt-5" loading={isPending}>
            {updatingRowId ? 'Save' : 'Create'}
          </Button>
        </form>
      </Form>
    </FormDialog>
  )
}
export default TagForm
