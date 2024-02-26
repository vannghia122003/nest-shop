import Button from '~/components/Button'
import Input from '~/components/Input'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import userApi from '~/apis/user.api'
import { toast } from 'react-toastify'
import { isUnprocessableEntity } from '~/utils/errors'
import { ErrorResponse } from '~/types/response.type'

const changePasswordSchema = yup.object({
  old_password: yup.string().required('Nhập mật khẩu cũ').min(6, 'Độ dài ít nhất 6 kí tự'),
  password: yup.string().required('Nhập mật khẩu mới').min(6, 'Độ dài ít nhất 6 kí tự'),
  confirm_password: yup
    .string()
    .required('Nhập lại mật khẩu mới')
    .min(6, 'Độ dài ít nhất 6 kí tự')
    .oneOf([yup.ref('password')], 'Nhập lại mật khẩu không chính xác')
})
type FormData = yup.InferType<typeof changePasswordSchema>

function ChangePassword() {
  const form = useForm<FormData>({
    resolver: yupResolver(changePasswordSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })
  const changePasswordMutation = useMutation({
    mutationFn: userApi.changePassword
  })

  const onSubmit = (data: FormData) => {
    changePasswordMutation.mutate(data, {
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
    <div className="rounded-sm bg-white px-2 pb-10 shadow md:px-8 md:pb-20">
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize text-secondary">Đổi mật khẩu</h1>
        <div className="mt-1 text-sm text-secondary">
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </div>
      </div>
      <form
        className="mr-auto mt-8 max-w-2xl text-secondary"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex-grow md:pr-8 xl:pr-0">
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-4">
            <div className="truncate pt-4 sm:basis-[150px] sm:text-right">Mật khẩu cũ</div>
            <div className="sm:basis-3/5">
              <Input
                placeholder="Nhập mật khẩu cũ"
                name="old_password"
                type="password"
                formObj={form}
              />
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-4">
            <div className="truncate pt-4 sm:basis-[150px] sm:text-right">Mật khẩu mới</div>
            <div className="sm:basis-3/5">
              <Input
                placeholder="Nhập mật khẩu mới"
                name="password"
                type="password"
                formObj={form}
              />
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-4">
            <div className="truncate pt-4 sm:basis-[150px] sm:text-right">Xác nhận mật khẩu</div>
            <div className="sm:basis-3/5">
              <Input
                placeholder="Nhập lại mật khẩu mới"
                name="confirm_password"
                type="password"
                formObj={form}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-5">
            <div className="sm:basis-[150px]"></div>
            <Button
              className="py-2 rounded-md bg-primary px-6 text-center text-sm text-white font-bold hover:opacity-70 duration-300"
              type="submit"
              isLoading={changePasswordMutation.isPending}
              disabled={changePasswordMutation.isPending}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ChangePassword
