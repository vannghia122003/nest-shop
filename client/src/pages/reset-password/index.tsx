import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { authApi } from '@/api'
import FormText from '@/components/form-input/form-text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { IErrorResponse } from '@/types/response'
import { isUnauthorizedError } from '@/utils/error'
import { handleUnprocessableEntityError } from '@/utils/helper'
import PATH from '@/utils/path'

const schema = z
  .object({
    password: z.string().min(1, { message: 'Password is required' }).min(6).max(30),
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }).min(6).max(30)
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

function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resetPasswordMutation = useMutation({ mutationFn: authApi.resetPassword })
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: { password: '', confirmPassword: '' }
  })
  const resetPasswordToken = searchParams.get('resetPasswordToken')

  useEffect(() => {
    if (!resetPasswordToken) navigate(PATH.LOGIN)
  }, [navigate, resetPasswordToken])

  const handleSubmit = form.handleSubmit(async (data: FormData) => {
    try {
      const res = await resetPasswordMutation.mutateAsync({
        password: data.password,
        resetPasswordToken: resetPasswordToken!
      })
      toast.success(res.message)
      navigate(PATH.LOGIN)
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error)
      handleUnprocessableEntityError(error, form.setError)
      if (isUnauthorizedError<IErrorResponse>(error)) {
        toast.error(error.response?.data.message)
        navigate(PATH.LOGIN)
      }
    }
  })

  return (
    <Card className="w-full sm:w-[400px] lg:w-[480px]">
      <Helmet>
        <title>Reset Password | Nest Shop</title>
        <meta name="description" content="Reset Password" />
      </Helmet>

      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">Set your password</CardTitle>
        <CardDescription>
          Enter your registered email and we will send you a link to reset your password.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="grid grid-cols-1 gap-2" onSubmit={handleSubmit}>
            <FormText
              form={form}
              name="password"
              placeholder="Enter your password"
              label="Password"
              type="password"
              inputProps={{ autoComplete: 'new-password' }}
            />
            <FormText
              form={form}
              name="confirmPassword"
              placeholder="Enter confirm password"
              label="Confirm password"
              type="password"
              inputProps={{ autoComplete: 'new-password' }}
            />
            <Button className="mt-2" loading={resetPasswordMutation.isPending}>
              Continue
            </Button>
          </form>
        </Form>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <span className="mr-1">Don't have account?</span>
          <Button variant="link" className="p-0" asChild>
            <Link to={PATH.SIGN_UP}>Sign up</Link>
          </Button>
        </p>
      </CardContent>
    </Card>
  )
}

export default ResetPassword
