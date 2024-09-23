import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import omitBy from 'lodash/omitBy'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { fileApi, roleApi, userApi } from '@/api'
import { useTableContext } from '@/components/data-table/table-provider'
import FormDialog from '@/components/form-dialog'
import FormDataPicker from '@/components/form-input/form-date-picker'
import FormFileUpload from '@/components/form-input/form-file-upload'
import FormSelect from '@/components/form-input/form-select'
import FormText from '@/components/form-input/form-text'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { PHONE_NUMBER_REGEX } from '@/utils/constants'
import { handleUnprocessableEntityError } from '@/utils/helper'
import QUERY_KEY from '@/utils/query-key'

const schema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }).max(30),
    roleId: z.coerce.number({ message: 'Role is required' }).int().positive(),
    phone: z.string().refine((val) => (val !== '' ? PHONE_NUMBER_REGEX.test(val) : true), {
      message: 'Invalid phone number.'
    }),
    address: z.string().max(50),
    avatar: z.string().url().nullable(),
    dateOfBirth: z.date().nullable(),
    password: z.string().min(1, { message: 'Password is required' }).min(6).max(30).nullable(),
    confirmPassword: z
      .string()
      .min(1, { message: 'Confirm password is required' })
      .min(6)
      .max(30)
      .nullable()
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

function UpdateUserForm() {
  const queryClient = useQueryClient()
  const { updatingRowId, setUpdatingRowId } = useTableContext()
  const [file, setFile] = useState<File | null>(null)
  const [isChangePassword, setIsChangePassword] = useState(false)
  const updateUserMutation = useMutation({ mutationFn: userApi.updateUser })
  const uploadImageMutation = useMutation({ mutationFn: fileApi.uploadImage })
  const isPending = uploadImageMutation.isPending || updateUserMutation.isPending
  const { data: dataRole } = useQuery({
    queryKey: [QUERY_KEY.ROLES],
    queryFn: () => roleApi.getAllRoles()
  })
  const { data: dataUser } = useQuery({
    queryKey: [QUERY_KEY.USER, updatingRowId],
    queryFn: () => userApi.getUserById(updatingRowId!),
    enabled: Boolean(updatingRowId)
  })
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      roleId: 0,
      password: null,
      confirmPassword: null
    }
  })
  const avatar = form.watch('avatar')

  useEffect(() => {
    if (dataUser) {
      const user = dataUser.data
      form.setValue('name', user.name || '')
      form.setValue('phone', user.phone || '')
      form.setValue('address', user.address || '')
      form.setValue('roleId', user.role.id)
      form.setValue('avatar', user.avatar)
      form.setValue('dateOfBirth', user.dateOfBirth ? new Date(user.dateOfBirth) : null)
    }
  }, [dataUser, form])

  const handleCheckedChange = (checked: boolean) => {
    form.setValue('password', checked ? '' : null)
    form.setValue('confirmPassword', checked ? '' : null)
    setIsChangePassword(checked)
    if (!checked) {
      form.clearErrors('password')
      form.clearErrors('confirmPassword')
    }
  }

  const handleFileChange = (files: File[]) => {
    setFile(files[0])
  }

  const handleOpenChangeDialog = (open: boolean) => {
    if (!open) {
      form.reset()
      setFile(null)
      setUpdatingRowId(null)
      setIsChangePassword(false)
    }
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    const body = omitBy(
      { ...data, dateOfBirth: data.dateOfBirth?.toISOString() },
      (v) => v === null || v === undefined || v === ''
    )
    try {
      if (file) {
        const formData = new FormData()
        formData.append('images', file)
        const res = await uploadImageMutation.mutateAsync(formData)
        const imageUrl = res.data[0]
        body.avatar = imageUrl
      }
      const res = await updateUserMutation.mutateAsync({ userId: updatingRowId!, body })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USERS] })
      toast.success(res.message)
      setUpdatingRowId(null)
    } catch (error) {
      handleUnprocessableEntityError(error, form.setError)
    }
  })

  return (
    <FormDialog
      open={!!updatingRowId}
      title="Update user"
      description="Update user here. Click save when you're done."
      onOpenChange={handleOpenChangeDialog}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormFileUpload
              form={form}
              name="avatar"
              label="Avatar"
              className="col-span-full"
              onChange={handleFileChange}
              value={avatar ? [avatar] : undefined}
            />
            <FormText form={form} name="name" label="Name" placeholder="Enter your name" />
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input value={dataUser?.data.email ?? ''} disabled autoComplete="email" />
              </FormControl>
            </FormItem>
            <FormText
              form={form}
              name="phone"
              label="Phone"
              placeholder="Enter your phone"
              type="number"
            />
            <FormText form={form} name="address" label="Address" placeholder="Enter your address" />
            <FormDataPicker
              form={form}
              name="dateOfBirth"
              label="Date of birth"
              placeholder="Pick a date"
            />
            <FormSelect
              form={form}
              name="roleId"
              label="Role"
              placeholder="Select role"
              data={dataRole?.data.data}
            />
            <div className="col-span-full flex items-center space-x-2">
              <Switch
                id="change-password"
                checked={isChangePassword}
                onCheckedChange={handleCheckedChange}
              />
              <Label htmlFor="change-password">Change password</Label>
            </div>
            {isChangePassword && (
              <>
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
              </>
            )}
          </div>
          <Button type="submit" className="mt-5" loading={isPending}>
            Save
          </Button>
        </form>
      </Form>
    </FormDialog>
  )
}

export default UpdateUserForm
