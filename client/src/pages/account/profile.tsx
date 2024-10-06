import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import omit from 'lodash/omit'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { fileApi } from '@/api'
import accountApi from '@/api/account-api'
import FormDataPicker from '@/components/form-input/form-date-picker'
import FormFileUpload from '@/components/form-input/form-file-upload'
import FormText from '@/components/form-input/form-text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useAppContext } from '@/contexts/app-provider'
import { PHONE_NUMBER_REGEX } from '@/utils/constants'
import { handleUnprocessableEntityError, setItemLocalStorage } from '@/utils/helper'
import QUERY_KEY from '@/utils/query-key'

const schema = z.object({
  email: z.string(),
  name: z.string().min(1, { message: 'Name is required' }).max(30),
  phone: z.string().refine((value) => PHONE_NUMBER_REGEX.test(value), {
    message: 'Invalid phone number'
  }),
  address: z.string().min(1, { message: 'Address is required' }),
  avatar: z.string().url().nullable(),
  dateOfBirth: z.date().nullable()
})
type FormData = z.infer<typeof schema>

function Profile() {
  const { setProfile } = useAppContext()
  const [file, setFile] = useState<File | null>(null)
  const updateMeMutation = useMutation({ mutationFn: accountApi.updateMe })
  const uploadImageMutation = useMutation({ mutationFn: fileApi.uploadImage })
  const sendVerificationEmailMutation = useMutation({
    mutationFn: accountApi.sendVerificationEmail
  })
  const isPending = updateMeMutation.isPending || uploadImageMutation.isPending
  const { data, refetch } = useQuery({
    queryKey: [QUERY_KEY.PROFILE],
    queryFn: accountApi.getMe,
  })
  const profile = data?.data
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    shouldFocusError: false,
    defaultValues: { email: '', name: '', phone: '', address: '', avatar: null, dateOfBirth: null }
  })
  const avatar = form.watch('avatar')

  useEffect(() => {
    if (profile) {
      form.setValue('email', profile.email)
      form.setValue('name', profile.name)
      form.setValue('phone', profile.phone ?? '')
      form.setValue('address', profile.address ?? '')
      form.setValue('avatar', profile.avatar)
      form.setValue('dateOfBirth', profile.dateOfBirth ? new Date(profile.dateOfBirth) : null)
    }
  }, [form, profile])

  const handleFileChange = (files: File[]) => {
    setFile(files[0])
  }

  const handleSendVerificationEmail = async () => {
    const res = await sendVerificationEmailMutation.mutateAsync()
    toast.success(res.message)
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    const body = omit(
      { ...values, dateOfBirth: values.dateOfBirth && values.dateOfBirth.toISOString() },
      ['email']
    )

    try {
      if (file) {
        const formData = new FormData()
        formData.append('images', file)
        const res = await uploadImageMutation.mutateAsync(formData)
        const imageUrl = res.data[0]
        body.avatar = imageUrl
      }
      const res = await updateMeMutation.mutateAsync(body)
      await refetch()
      setProfile(res.data)
      setFile(null)
      setItemLocalStorage('profile', JSON.stringify(res.data))
      toast.success(res.message)
    } catch (error) {
      handleUnprocessableEntityError(error, form.setError)
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>Manage and protect your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
            <FormFileUpload
              form={form}
              name="avatar"
              label="Avatar"
              value={avatar ? [avatar] : undefined}
              onChange={handleFileChange}
            />
            <div>
              <FormText
                form={form}
                name="email"
                label={`Email ${profile?.isActive ? '✔' : '❌'}`}
                disabled
              />
              {!profile?.isActive && (
                <div className="mt-3 flex items-center">
                  <p className="text-sm text-secondary-foreground">
                    You have not verified your email.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={handleSendVerificationEmail}
                    loading={sendVerificationEmailMutation.isPending}
                  >
                    Verify
                  </Button>
                </div>
              )}
            </div>
            <FormText form={form} name="name" label="Name" placeholder="Enter your name" />
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
              placeholder="Select date"
            />

            <div>
              <Button type="submit" loading={isPending} disabled={isPending}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default Profile
