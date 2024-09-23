import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { permissionApi } from '@/api'
import { useTableContext } from '@/components/data-table/table-provider'
import FormDialog from '@/components/form-dialog'
import FormSelect from '@/components/form-input/form-select'
import FormText from '@/components/form-input/form-text'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { handleUnprocessableEntityError } from '@/utils/helper'
import QUERY_KEY from '@/utils/query-key'

const schema = z.object({
  path: z.string().min(1, { message: 'Name is required' }),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
    message: 'Method is required'
  }),
  module: z.string().min(1, { message: 'Module is required' }),
  description: z.string().min(1, { message: 'Description is required' }).max(100)
})
type FormData = z.infer<typeof schema>

function PermissionForm() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState<boolean>(false)
  const { updatingRowId, setUpdatingRowId } = useTableContext()
  const createPermissionMutation = useMutation({ mutationFn: permissionApi.createPermission })
  const updatePermissionMutation = useMutation({ mutationFn: permissionApi.updatePermission })
  const isPending = createPermissionMutation.isPending || updatePermissionMutation.isPending
  const { data: permissionData } = useQuery({
    queryKey: [QUERY_KEY.PERMISSION_DETAIL, updatingRowId],
    queryFn: () => permissionApi.getPermissionById(updatingRowId!),
    enabled: Boolean(updatingRowId)
  })
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldFocusError: false,
    defaultValues: { path: '', method: '' as 'GET', module: '', description: '' }
  })

  useEffect(() => {
    form.clearErrors()
    if (permissionData) {
      form.setValue('path', permissionData.data.path)
      form.setValue('method', permissionData.data.method)
      form.setValue('module', permissionData.data.module)
      form.setValue('description', permissionData.data.description)
    }
  }, [permissionData, form])

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
        const res = await updatePermissionMutation.mutateAsync({
          permissionId: updatingRowId,
          body: data
        })
        toast.success(res.message)
        setUpdatingRowId(null)
      } else {
        const res = await createPermissionMutation.mutateAsync(data)
        toast.success(res.message)
        setOpen(false)
      }
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PERMISSIONS] })
      form.reset()
    } catch (error) {
      handleUnprocessableEntityError(error, form.setError)
    }
  })

  return (
    <FormDialog
      open={open || Boolean(updatingRowId)}
      title={updatingRowId ? 'Update permission' : 'Create permission'}
      description={
        updatingRowId
          ? "Update permission here. Click save when you're done."
          : "Create new permission here. Click create when you're done."
      }
      onOpenChange={handleOpenChangeDialog}
      btnTrigger={<Button>Add new</Button>}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <FormText
              form={form}
              name="description"
              label="Description"
              placeholder="Enter description"
            />
            <FormText form={form} name="path" label="Path" placeholder="Enter path" />
            <FormSelect
              form={form}
              name="method"
              label="Method"
              placeholder="Select method"
              data={[
                { id: 'GET' },
                { id: 'POST' },
                { id: 'PUT' },
                { id: 'PATCH' },
                { id: 'DELETE' }
              ]}
            />
            <FormText form={form} name="module" label="Module" placeholder="Enter module" />
          </div>
          <Button type="submit" className="mt-5" loading={isPending}>
            {updatingRowId ? 'Save' : 'Create'}
          </Button>
        </form>
      </Form>
    </FormDialog>
  )
}
export default PermissionForm
