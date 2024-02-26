import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import authApi from '~/apis/auth.api'
import userApi from '~/apis/user.api'
import Button from '~/components/Button'
import Input from '~/components/Input'
import path from '~/constants/path'
import { AppContext } from '~/contexts/app.context'
import { ErrorResponse } from '~/types/response.type'
import {
  setAccessTokenToLocalStorage,
  setProfileToLocalStorage,
  setRefreshTokenToLocalStorage
} from '~/utils/auth'
import { isUnauthorizedError, isUnprocessableEntity } from '~/utils/errors'

const loginSchema = yup.object({
  email: yup.string().required('Email là bắt buộc').email('Email không đúng định dạng'),
  password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Độ dài ít nhất 6 kí tự')
})
type FormData = yup.InferType<typeof loginSchema>

function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const form = useForm<FormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  const loginMutation = useMutation({ mutationFn: authApi.login })

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data, {
      onSuccess: async (data) => {
        const { access_token, refresh_token } = data.result
        setIsAuthenticated(true)
        setAccessTokenToLocalStorage(access_token)
        setRefreshTokenToLocalStorage(refresh_token)

        const user = await userApi.getMe()
        setProfile(user.result)
        setProfileToLocalStorage(user.result)
        toast.success(data.message)
      },
      onError: (error) => {
        if (isUnauthorizedError<ErrorResponse<undefined>>(error)) {
          toast.error(error.response?.data.message)
        }
        if (isUnprocessableEntity<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.errors

          if (formError) {
            Object.keys(formError).forEach((key) => {
              form.setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  }

  return (
    <>
      <Helmet>
        <title>Đăng nhập tài khoản | Nest Shop</title>
        <meta name="description" content="Đăng nhập để mua hàng trên Nest Shop" />
      </Helmet>
      <form
        className="rounded-md bg-white p-8 shadow-sm text-secondary"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="mb-2 text-center text-3xl font-bold">Đăng nhập</h1>
        <div className="mb-7 text-center">
          Bạn chưa có tài khoản?{' '}
          <Link className="text-primary" to={path.register}>
            Đăng ký
          </Link>
        </div>
        <Input type="text" name="email" placeholder="Nhập email" className="mb-2" formObj={form} />
        <Input
          type="password"
          name="password"
          placeholder="Nhập mật khẩu"
          className="mb-2"
          classNameEye="absolute right-[10px] top-[15px] h-5 w-5 cursor-pointer"
          formObj={form}
        />
        <div>
          <Button
            type="submit"
            className="rounded-lg bg-secondary py-3 text-center text-base font-bold text-white duration-300 hover:bg-[#29A56C] w-full"
            isLoading={loginMutation.isPending}
            disabled={loginMutation.isPending}
          >
            Đăng nhập
          </Button>
        </div>
        <div className="mt-4 text-center">
          <Link
            to={path.forgotPassword}
            className="text-sm hover:text-primary duration-300 text-[#7E7E7E]"
          >
            Quên mật khẩu
          </Link>
        </div>
      </form>
    </>
  )
}

export default Login
