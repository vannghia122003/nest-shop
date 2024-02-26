import { Helmet } from 'react-helmet-async'
import Button from '~/components/Button'
import Input from '~/components/Input'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useNavigate } from 'react-router-dom'
import path from '~/constants/path'
import { useMutation } from '@tanstack/react-query'
import authApi from '~/apis/auth.api'
import { FaArrowLeft } from 'react-icons/fa'
import { ErrorResponse } from '~/types/response.type'
import { isUnprocessableEntity } from '~/utils/errors'
import { toast } from 'react-toastify'

const forgotPasswordSchema = yup.object({
  email: yup.string().required('Vui lòng nhập email').email('Email không đúng định dạng')
})
type FormData = yup.InferType<typeof forgotPasswordSchema>

function ForgotPassword() {
  const navigate = useNavigate()
  const form = useForm<FormData>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })
  const forgotPasswordMutation = useMutation({ mutationFn: authApi.forgotPassword })

  const onSubmit = (data: FormData) => {
    forgotPasswordMutation.mutate(data.email, {
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
    <div>
      <Helmet>
        <title>Nest Shop | Website thương mại điện tử</title>
        <meta name="description" content="Mua sắm trực tuyến tại Nest Shop" />
      </Helmet>
      <form
        className="rounded-md bg-white p-8 shadow-sm text-secondary"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="mb-10 text-center text-3xl font-bold relative">
          <span>Đặt lại mật khẩu</span>
          <span
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 left-0 text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </span>
        </h1>

        <Input type="text" name="email" placeholder="Nhập email" className="mb-2" formObj={form} />
        <div>
          <Button
            type="submit"
            className="rounded-lg bg-secondary py-3 text-center text-base font-bold text-white duration-300 hover:bg-[#29A56C] w-full"
            isLoading={forgotPasswordMutation.isPending}
            disabled={forgotPasswordMutation.isPending}
          >
            Tiếp theo
          </Button>
        </div>
        <div className="mt-4 text-center">
          <Link to={path.login} className="text-sm hover:text-primary duration-300 text-[#7E7E7E]">
            Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword
