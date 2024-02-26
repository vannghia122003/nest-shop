import { Helmet } from 'react-helmet-async'
import Button from '~/components/Button'
import Input from '~/components/Input'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import authApi from '~/apis/auth.api'
import { useQueryParams } from '~/hooks'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import path from '~/constants/path'
import { ErrorResponse } from '~/types/response.type'
import { isUnprocessableEntity } from '~/utils/errors'

const resetPasswordSchema = yup.object({
  password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Độ dài ít nhất 6 kí tự'),
  confirm_password: yup
    .string()
    .required('Nhập lại mật khẩu là bắt buộc')
    .min(6, 'Độ dài ít nhất 6 kí tự')
    .oneOf([yup.ref('password')], 'Nhập lại mật khẩu không chính xác')
})
type FormData = yup.InferType<typeof resetPasswordSchema>

function ResetPassword() {
  const { token } = useQueryParams()
  const form = useForm<FormData>({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })
  const resetPasswordMutation = useMutation({ mutationFn: authApi.resetPassword })

  const onSubmit = (data: FormData) => {
    resetPasswordMutation.mutate(
      { ...data, reset_password_token: token as string },
      {
        onSuccess: () => {
          form.reset()
          toast.success('Mật khẩu đã được đặt lại')
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
          } else {
            toast.error('Đường dẫn hết hạn, vui lòng thử lại')
          }
        }
      }
    )
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
          <span>Thiết lập mật khẩu</span>
          {/* <span
            aria-hidden="true"
            className="absolute top-1/2 -translate-y-1/2 left-0 text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </span> */}
        </h1>

        <Input
          type="password"
          name="password"
          placeholder="Nhập mật khẩu"
          className="mb-2"
          formObj={form}
        />
        <Input
          type="password"
          name="confirm_password"
          placeholder="Nhập lại mật khẩu"
          className="mb-2"
          formObj={form}
        />
        <div>
          <Button
            type="submit"
            className="rounded-lg bg-secondary py-3 text-center text-base font-bold text-white duration-300 hover:bg-[#29A56C] w-full"
            isLoading={resetPasswordMutation.isPending}
            disabled={resetPasswordMutation.isPending}
          >
            Tiếp tục
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

export default ResetPassword
