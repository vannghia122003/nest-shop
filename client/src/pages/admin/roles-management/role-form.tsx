import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import groupBy from 'lodash/groupBy'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { permissionApi, roleApi } from '@/api'
import { useTableContext } from '@/components/data-table/table-provider'
import FormDialog from '@/components/form-dialog'
import FormText from '@/components/form-input/form-text'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { methodColors } from '@/pages/admin/permissions-management/columns'
import { cn, handleUnprocessableEntityError } from '@/utils/helper'
import QUERY_KEY from '@/utils/query-key'

const schema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(30),
  description: z.string().min(1, { message: 'Description is required' }).max(100),
  permissionIds: z.array(z.number().int().gt(0))
})
type FormData = z.infer<typeof schema>

function RoleForm() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState<boolean>(false)
  const { updatingRowId, setUpdatingRowId } = useTableContext()
  const createRoleMutation = useMutation({ mutationFn: roleApi.createRole })
  const updateRoleMutation = useMutation({ mutationFn: roleApi.updateRole })
  const isPending = createRoleMutation.isPending || updateRoleMutation.isPending
  const { data: permissionsData } = useQuery({
    queryKey: [QUERY_KEY.PERMISSIONS],
    queryFn: () => permissionApi.getAllPermissions({ limit: '-1' })
  })
  const { data: roleData } = useQuery({
    queryKey: [QUERY_KEY.ROLE_DETAIL, updatingRowId],
    queryFn: () => roleApi.getRoleById(updatingRowId!),
    enabled: Boolean(updatingRowId)
  })
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldFocusError: false,
    defaultValues: { name: '', description: '', permissionIds: [] }
  })
  const permissionIds = form.watch('permissionIds')
  const permissions = groupBy(permissionsData?.data.data, 'module')

  useEffect(() => {
    form.clearErrors()
    if (roleData) {
      form.setValue('name', roleData.data.name)
      form.setValue('description', roleData.data.description)
      form.setValue(
        'permissionIds',
        roleData.data.permissions.map((permission) => permission.id)
      )
    }
  }, [roleData, form])

  const handleOpenChangeDialog = (open: boolean) => {
    setOpen(open)
    form.reset()
    if (!open) {
      setUpdatingRowId(null)
    }
  }

  const handleTogglePermission = (checked: boolean, permissionId: number) => {
    if (checked && !permissionIds.includes(permissionId)) {
      form.setValue('permissionIds', [...permissionIds, permissionId])
    }
    if (!checked && permissionIds.includes(permissionId)) {
      form.setValue(
        'permissionIds',
        permissionIds.filter((id) => id !== permissionId)
      )
    }
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      if (updatingRowId) {
        const res = await updateRoleMutation.mutateAsync({
          roleId: updatingRowId,
          body: data
        })
        toast.success(res.message)
        setUpdatingRowId(null)
      } else {
        const res = await createRoleMutation.mutateAsync(data)
        toast.success(res.message)
        setOpen(false)
      }
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ROLES] })
      form.reset()
    } catch (error) {
      handleUnprocessableEntityError(error, form.setError)
    }
  })

  return (
    <FormDialog
      open={open || Boolean(updatingRowId)}
      title="Create role"
      description="Create new role here. Click create when you're done."
      onOpenChange={handleOpenChangeDialog}
      btnTrigger={<Button>Add new</Button>}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <FormText form={form} name="name" label="Name" placeholder="Enter role name" />
            <FormText
              form={form}
              name="description"
              label="Description"
              placeholder="Enter role description"
            />
            {updatingRowId && (
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Permissions
                </label>
                <Accordion type="single" className="!mt-0 px-2" collapsible>
                  {Object.entries(permissions).map(([key, value]) => (
                    <AccordionItem value={key} key={key}>
                      <AccordionTrigger>{key}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          {value.map((permission) => (
                            <div key={permission.id}>
                              <p className="mb-2 font-medium">{permission.description}</p>
                              <div className="flex items-center gap-4">
                                <Switch
                                  id={`${permission.id}`}
                                  checked={permissionIds.includes(permission.id)}
                                  onCheckedChange={(checked) =>
                                    handleTogglePermission(checked, permission.id)
                                  }
                                />
                                <Label
                                  htmlFor={`${permission.id}`}
                                  className="cursor-pointer font-normal"
                                >
                                  <p
                                    className={cn('font-semibold', methodColors[permission.method])}
                                  >
                                    {permission.method}
                                  </p>
                                  <p className="break-all">{permission.path}</p>
                                </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
          <Button type="submit" className="mt-5" loading={isPending}>
            {updatingRowId ? 'Save' : 'Create'}
          </Button>
        </form>
      </Form>
    </FormDialog>
  )
}
export default RoleForm
