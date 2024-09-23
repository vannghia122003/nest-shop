import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { authApi } from '@/api'
import FormText from '@/components/form-input/form-text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { handleUnprocessableEntityError } from '@/utils/helper'
import PATH from '@/utils/path'

const schema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email()
})
type FormData = z.infer<typeof schema>

function ForgotPassword() {
  const forgotPasswordMutation = useMutation({ mutationFn: authApi.forgotPassword })
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: { email: '' }
  })

  const handleSubmit = form.handleSubmit(async (data: FormData) => {
    try {
      const res = await forgotPasswordMutation.mutateAsync(data)
      toast.success(res.message)
      form.reset()
    } catch (error) {
      handleUnprocessableEntityError(error, form.setError)
    }
  })

  return (
    <Card className="w-full sm:w-[400px] lg:w-[480px]">
      <Helmet>
        <title>Forgot Password | Nest Shop</title>
        <meta name="description" content="Forgot Password" />
      </Helmet>

      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">Forgot password</CardTitle>
        <CardDescription>
          Enter your registered email and we will send you a link to reset your password.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="grid grid-cols-1 gap-2" onSubmit={handleSubmit}>
            <FormText
              form={form}
              name="email"
              placeholder="Enter your email"
              label="Email"
              inputProps={{ autoComplete: 'email' }}
            />
            <Button className="mt-2" loading={forgotPasswordMutation.isPending}>
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

export default ForgotPassword
