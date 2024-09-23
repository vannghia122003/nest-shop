import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import accountApi from '@/api/account-api'
import FormText from '@/components/form-input/form-text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { IEntityErrorResponse } from '@/types/response'
import { isUnprocessableEntity } from '@/utils/error'

const schema = z
  .object({
    oldPassword: z.string().min(1, { message: 'Password is required' }).min(6).max(30),
    newPassword: z.string().min(1, { message: 'New password is required' }).min(6).max(30),
    confirmNewPassword: z
      .string()
      .min(1, { message: 'Confirm new password is required' })
      .min(6)
      .max(30)
  })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Confirm new password does not match',
        path: ['confirmNewPassword']
      })
    }
  })
type FormData = z.infer<typeof schema>

function ChangePassword() {
  const changePasswordMutation = useMutation({ mutationFn: accountApi.changePassword })
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const res = await changePasswordMutation.mutateAsync(values)
      form.reset()
      toast.success(res.message)
    } catch (error) {
      if (isUnprocessableEntity<IEntityErrorResponse>(error)) {
        const formError = error.response?.data.message
        if (formError) {
          formError.forEach((err) => {
            form.setError(err.field as keyof FormData, {
              message: err.message
            })
          })
        }
      }
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          For your account's security, do not share your password with anyone else
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="grid max-w-xl grid-cols-1 gap-4">
            <FormText
              form={form}
              name="oldPassword"
              label="Old password"
              placeholder="Enter your old password"
              type="password"
            />
            <FormText
              form={form}
              name="newPassword"
              label="New password"
              placeholder="Enter your new password"
              type="password"
            />
            <FormText
              form={form}
              name="confirmNewPassword"
              label="Confirm new password"
              placeholder="Enter your confirm new password"
              type="password"
            />
            <div>
              <Button
                type="submit"
                loading={changePasswordMutation.isPending}
                disabled={changePasswordMutation.isPending}
              >
                Confirm
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
export default ChangePassword
