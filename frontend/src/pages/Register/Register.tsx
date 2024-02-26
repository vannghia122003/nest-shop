import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import authApi from '~/apis/auth.api'
import Button from '~/components/Button'
import Input from '~/components/Input'
import { ErrorResponse } from '~/types/response.type'
import { isUnprocessableEntity } from '~/utils/errors'

const registerSchema = yup.object({
  name: yup.string().required('Tên là bắt buộc').min(2, 'Độ dài ít nhất 2 kí tự'),
  email: yup.string().required('Email là bắt buộc').email('Email không đúng định dạng'),
  password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Độ dài ít nhất 6 kí tự'),
  confirm_password: yup
    .string()
    .required('Nhập lại mật khẩu là bắt buộc')
    .min(6, 'Độ dài ít nhất 6 kí tự')
    .oneOf([yup.ref('password')], 'Nhập lại mật khẩu không chính xác'),
  address: yup.string().required('Địa chỉ là bắt buộc')
})

type FormData = yup.InferType<typeof registerSchema>

function Register() {
  const form = useForm<FormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })

  const registerMutation = useMutation({
    mutationFn: authApi.register
  })

  const onSubmit = (data: FormData) => {
    registerMutation.mutate(data, {
      onSuccess: (data) => {
        form.reset()
        toast.success(data.message)
      },
      onError: (error) => {
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
        <title>Đăng kí tài khoản | Nest Shop</title>
        <meta name="description" content="Đăng kí tài khoản Nest Shop" />
      </Helmet>
      <form
        className="rounded-md bg-white p-8 shadow-sm text-secondary"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="mb-2 text-center text-3xl font-bold">Đăng ký</h1>
        <div className="mb-7 text-center">
          Bạn đã có tài khoản?{' '}
          <Link className="text-primary" to="/login">
            Đăng nhập
          </Link>
        </div>
        <Input type="text" name="name" placeholder="Nhập tên" className="mb-2" formObj={form} />
        <Input
          type="text"
          name="address"
          placeholder="Nhập địa chỉ"
          className="mb-2"
          formObj={form}
        />
        <Input type="text" name="email" placeholder="Nhập email" className="mb-2" formObj={form} />
        <Input
          type="password"
          name="password"
          placeholder="Nhập mật khẩu"
          className="mb-2"
          formObj={form}
        />
        <Input
          name="confirm_password"
          type="password"
          placeholder="Nhập lại mật khẩu"
          className="mb-2"
          formObj={form}
        />
        <div>
          <Button
            className="rounded-lg bg-secondary w-full py-3 text-center text-base font-bold text-white duration-300 hover:bg-[#29A56C]"
            isLoading={registerMutation.isPending}
            disabled={registerMutation.isPending}
          >
            Đăng ký
          </Button>
        </div>
      </form>
    </>
  )
}

export default Register
