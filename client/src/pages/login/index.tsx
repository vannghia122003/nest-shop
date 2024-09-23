import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandGoogleFilled } from '@tabler/icons-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { authApi } from '@/api'
import accountApi from '@/api/account-api'
import FormText from '@/components/form-input/form-text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { useAppContext } from '@/contexts/app-provider'
import { IErrorResponse } from '@/types/response'
import { GOOGLE_AUTH_URL } from '@/utils/constants'
import { isUnauthorizedError } from '@/utils/error'
import { handleUnprocessableEntityError, setItemLocalStorage } from '@/utils/helper'
import PATH from '@/utils/path'
import QUERY_KEY from '@/utils/query-key'

const schema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: z.string().min(1, { message: 'Password is required' }).min(6).max(30)
})
type FormData = z.infer<typeof schema>

function SignIn() {
  const [searchParams] = useSearchParams()
  const { setIsAuthenticated, setProfile } = useAppContext()
  const loginMutation = useMutation({ mutationFn: authApi.login })
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: { email: '', password: '' }
  })

  const accessToken = searchParams.get('accessToken')
  const refreshToken = searchParams.get('refreshToken')
  useQuery({
    queryKey: [QUERY_KEY.PROFILE, accessToken, refreshToken],
    queryFn: async () => {
      setItemLocalStorage('accessToken', accessToken!)
      setItemLocalStorage('refreshToken', refreshToken!)
      const res = await accountApi.getMe()
      setIsAuthenticated(true)
      setProfile(res.data)
      setItemLocalStorage('profile', JSON.stringify(res.data))
      return res
    },
    enabled: Boolean(accessToken) && Boolean(refreshToken)
  })

  const handleSubmit = form.handleSubmit(async (data: FormData) => {
    try {
      const res = await loginMutation.mutateAsync(data)
      setIsAuthenticated(true)
      setProfile(res.data.user)
      setItemLocalStorage('accessToken', res.data.accessToken)
      setItemLocalStorage('refreshToken', res.data.refreshToken)
      setItemLocalStorage('profile', JSON.stringify(res.data.user))
      toast.success(res.message)
    } catch (error) {
      handleUnprocessableEntityError(error, form.setError)
      if (isUnauthorizedError<IErrorResponse>(error)) {
        toast.error(error.response?.data.message)
      }
    }
  })

  return (
    <Card className="w-full sm:w-[400px] lg:w-[480px]">
      <Helmet>
        <title>Login | Nest Shop</title>
        <meta name="description" content="Login" />
      </Helmet>

      <CardHeader>
        <CardTitle className="text-2xl font-semibold tracking-tight">Login</CardTitle>
        <CardDescription>
          Enter your email and password below to log into your account
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
            <FormText
              form={form}
              name="password"
              placeholder="Enter your password"
              label="Password"
              type="password"
              inputProps={{ autoComplete: 'current-password' }}
            />

            <Button className="mt-2" loading={loginMutation.isPending}>
              Login
            </Button>
            <Link
              to={PATH.FORGOT_PASSWORD}
              className="inline-block text-sm font-medium text-muted-foreground hover:opacity-75"
            >
              Forgot password?
            </Link>

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
                asChild
              >
                <Link to={GOOGLE_AUTH_URL}>Google</Link>
              </Button>
            </div>
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
export default SignIn
