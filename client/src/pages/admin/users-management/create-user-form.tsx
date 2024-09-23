import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { roleApi, userApi } from '@/api'
import FormDialog from '@/components/form-dialog'
import FormSelect from '@/components/form-input/form-select'
import FormText from '@/components/form-input/form-text'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { handleUnprocessableEntityError } from '@/utils/helper'
import QUERY_KEY from '@/utils/query-key'

const schema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }).max(30),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Email is invalid' }),
    password: z.string().trim().min(1, { message: 'Password is required' }).min(6).max(30),
    confirmPassword: z
      .string()
      .trim()
      .min(1, { message: 'Confirm password is required' })
      .min(6)
      .max(30),
    roleId: z.coerce.number({ message: 'Role is required' }).int().positive()
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Confirm password does not match',
        path: ['confirmPassword']
      })
    }
  })
type FormData = z.infer<typeof schema>

function CreateUserForm() {
  const [open, setOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const createUserMutation = useMutation({ mutationFn: userApi.createUser })
  const { data: dataRole } = useQuery({
    queryKey: [QUERY_KEY.ROLES],
    queryFn: () => roleApi.getAllRoles()
  })
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const res = await createUserMutation.mutateAsync(data)
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USERS] })
      form.reset()
      toast.success(res.message)
      setOpen(false)
    } catch (error) {
      handleUnprocessableEntityError(error, form.setError)
    }
  })

  return (
    <FormDialog
      open={open}
      title="Create user"
      description="Create new user here. Click create when you're done."
      onOpenChange={(open) => {
        form.reset()
        setOpen(open)
      }}
      btnTrigger={<Button>Add new</Button>}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormText form={form} name="name" label="Name" placeholder="Enter your name" />
            <FormText
              form={form}
              name="email"
              label="Email"
              placeholder="Enter your email"
              inputProps={{ autoComplete: 'email' }}
            />
            <FormText
              form={form}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              inputProps={{ autoComplete: 'new-password' }}
            />
            <FormText
              form={form}
              name="confirmPassword"
              label="Confirm password"
              placeholder="Enter your confirm password"
              type="password"
              inputProps={{ autoComplete: 'new-password' }}
            />
            <FormSelect
              form={form}
              name="roleId"
              label="Role"
              placeholder="Select role"
              className="col-span-full"
              data={dataRole?.data.data}
            />
          </div>
          <Button type="submit" className="mt-5" loading={createUserMutation.isPending}>
            Create
          </Button>
        </form>
      </Form>
    </FormDialog>
  )
}
export default CreateUserForm
