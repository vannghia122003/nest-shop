import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandGoogleFilled } from '@tabler/icons-react'
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
import { GOOGLE_AUTH_URL } from '@/utils/constants'
import { handleUnprocessableEntityError } from '@/utils/helper'
import PATH from '@/utils/path'

const schema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }).max(30),
    email: z.string().min(1, { message: 'Email is required' }).email(),
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

function SignUp() {
  const registerMutation = useMutation({ mutationFn: authApi.register })
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
  })

  const handleSubmit = form.handleSubmit(async (data: FormData) => {
    try {
      const res = await registerMutation.mutateAsync(data)
      form.reset()
      toast.success(res.message)
    } catch (error) {
      handleUnprocessableEntityError(error, form.setError)
    }
  })

  return (
    <Card className="w-full sm:w-[400px] lg:w-[480px]">
      <Helmet>
        <title>Register | Nest Shop</title>
        <meta name="description" content="Register" />
      </Helmet>

      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">Create an account</CardTitle>
        <CardDescription>Enter your email and password to create an account</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form className="grid grid-cols-1 gap-2" onSubmit={handleSubmit}>
            <FormText form={form} name="name" placeholder="Enter your name" label="Name" />
            <FormText
              form={form}
              name="email"
              placeholder="Enter your email"
              label="Email"
              inputProps={{ autoComplete: 'email' }}
            />
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
            <Button className="mt-2" loading={registerMutation.isPending}>
              Register
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Button
                variant="outline"
                className="w-full"
                type="button"
                leftSection={<IconBrandGoogleFilled className="size-4" />}
              >
                <Link to={GOOGLE_AUTH_URL}>Google</Link>
              </Button>
            </div>
          </form>
        </Form>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <span className="mr-1">Have an account?</span>
          <Button variant="link" className="p-0" asChild>
            <Link to={PATH.LOGIN}>Sign in</Link>
          </Button>
        </p>
      </CardContent>
    </Card>
  )
}

export default SignUp
