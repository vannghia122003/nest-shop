import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import authApi from '~/apis/auth.api'
import userApi from '~/apis/user.api'
import Button from '~/components/Button'
import DateSelect from '~/components/DateSelect'
import Input from '~/components/Input'
import InputFile from '~/components/InputFile/InputFile'
import InputNumber from '~/components/InputNumber'
import QUERY_KEYS from '~/constants/keys'
import { AppContext } from '~/contexts/app.context'
import { ErrorResponse } from '~/types/response.type'
import { setProfileToLocalStorage } from '~/utils/auth'
import { isUnprocessableEntity } from '~/utils/errors'
import { socket } from '~/utils/socket'

const updateProfileSchema = yup.object({
  email: yup.string(),
  name: yup.string().required('Tên không được để trống').min(2, 'Độ dài ít nhất 2 kí tự'),
  phone: yup
    .string()
    .required('Số điện thoại không được để trống')
    .min(10, 'Số điện thoại không hợp lệ')
    .max(11, 'Độ dài tối đa 11 kí tự'),
  address: yup.string().required('Địa chỉ không được để trống').min(6, 'Độ dài ít nhất 6 kí tự'),
  date_of_birth: yup.date().max(new Date(), 'Ngày không hợp lệ, vui lòng chọn ngày chính xác'),
  avatar: yup.string()
})
type FormData = yup.InferType<typeof updateProfileSchema>
interface FormDataError extends Omit<FormData, 'date_of_birth'> {
  date_of_birth?: string
}

function Profile() {
  const { setProfile } = useContext(AppContext)
  const form = useForm<FormData>({
    resolver: yupResolver(updateProfileSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })
  const { data: profileData, refetch } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: userApi.getMe
  })
  const updateProfileMutation = useMutation({ mutationFn: userApi.updateProfile })
  const uploadImageMutation = useMutation({ mutationFn: userApi.uploadImage })
  const sendVerifyEmailMutation = useMutation({ mutationFn: authApi.sendVerifyEmail })
  const profile = profileData?.result
  const avatar = form.watch('avatar')
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => file && URL.createObjectURL(file), [file])
  const [waitingTime, setWaitingTime] = useState(0)

  useEffect(() => {
    socket.emit('join_user_room', profile?._id as string)
    socket.on('verify_email_success', refetch)

    return () => {
      socket.off('verify_email_success', refetch)
    }
  }, [profile?._id, refetch])

  useEffect(() => {
    return () => {
      previewImage && URL.revokeObjectURL(previewImage)
    }
  }, [previewImage])

  useEffect(() => {
    if (profile) {
      form.setValue('email', profile.email)
      form.setValue('name', profile.name)
      form.setValue('phone', profile.phone)
      form.setValue('address', profile.address)
      form.setValue('avatar', profile.avatar)
      form.setValue('date_of_birth', new Date(profile.date_of_birth))
    }
  }, [form, profile])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (waitingTime > 0) {
      timer = setTimeout(() => {
        setWaitingTime((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      clearTimeout(timer)
    }
  }, [waitingTime])

  const onSubmit = async (data: FormData) => {
    try {
      if (file) {
        const formData = new FormData()
        formData.append('image', file)
        const uploadRes = await uploadImageMutation.mutateAsync(formData)
        const imageUrl = uploadRes.result[0]
        form.setValue('avatar', imageUrl)
      }

      const updateRes = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString()
      })
      refetch()
      setProfile(updateRes.result)
      setProfileToLocalStorage(updateRes.result)
      toast.success(updateRes.message)
    } catch (error) {
      if (isUnprocessableEntity<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.errors
        if (formError) {
          Object.keys(formError).forEach((key) => {
            form.setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  }

  const handleChangeFile = (file?: File) => {
    setFile(file)
  }

  const handleVerifyEmail = () => {
    sendVerifyEmailMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Kiểm tra email để xác minh')
        setWaitingTime(60)
      },
      onError: () => {
        toast.error('Xác minh thất bại. Vui lòng thử lại')
      }
    })
  }

  return (
    <div className="rounded-sm bg-white px-2 pb-10 shadow md:px-8 md:pb-20 text-secondary">
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize">Hồ sơ của tôi</h1>
        <div className="mt-1 text-sm">Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form
        className="mt-8 flex flex-col-reverse lg:flex-row gap-5 lg:gap-0"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex-grow md:mt-0  md:pr-6 xl:pr-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-5">
            <div className="truncate pt-4 sm:basis-1/5 lg:text-right">Email</div>
            <div
              className={clsx('grow', {
                'sm:basis-4/5': profile?.is_email_verified,
                'sm:basis-3/5': !profile?.is_email_verified
              })}
            >
              <div className="relative">
                <Input placeholder="Email" name="email" formObj={form} disabled />
                <div className="absolute top-[14px] right-3">
                  {profile?.is_email_verified && (
                    <span className="text-green-400">
                      <FaCheckCircle />
                    </span>
                  )}
                  {profile?.is_email_verified === false && (
                    <span className="text-red-500">
                      <FaTimesCircle />
                    </span>
                  )}
                </div>
              </div>
            </div>
            {profile?.is_email_verified === false && (
              <div className="grow">
                <Button
                  type="button"
                  className={clsx(
                    'px-2 py-3 text-sm text-secondary focus:outline-none bg-white rounded-lg border border-gray-200  duration-300 whitespace-nowrap',
                    {
                      'hover:border-primary hover:text-primary': waitingTime <= 0
                    }
                  )}
                  onClick={handleVerifyEmail}
                  isLoading={sendVerifyEmailMutation.isPending}
                  disabled={sendVerifyEmailMutation.isPending || waitingTime > 0}
                >
                  Xác minh {waitingTime > 0 && <span>({waitingTime})</span>}
                </Button>
              </div>
            )}
          </div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-5">
            <div className="truncate pt-4 sm:basis-1/5 lg:text-right">Tên</div>
            <div className="sm:basis-4/5">
              <Input placeholder="Tên" name="name" formObj={form} />
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-5">
            <div className="truncate pt-4 sm:basis-1/5 lg:text-right">Số điện thoại</div>
            <div className="sm:basis-4/5">
              <Controller
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <InputNumber
                    placeholder="Số điện thoại"
                    hasError
                    errorMessage={form.formState.errors.phone?.message}
                    {...field}
                    onChange={(event) => {
                      form.clearErrors('phone')
                      field.onChange(event)
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-5">
            <div className="truncate pt-4 sm:basis-1/5 lg:text-right">Địa chỉ</div>
            <div className="sm:basis-4/5">
              <Input placeholder="Địa chỉ" name="address" formObj={form} />
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-5">
            <div className="truncate pt-4 sm:basis-1/5 lg:text-right">Ngày sinh</div>
            <div className="sm:basis-4/5">
              <Controller
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <DateSelect
                    errorMessage={form.formState.errors.date_of_birth?.message}
                    value={field.value}
                    onChange={(value) => {
                      form.clearErrors('date_of_birth')
                      field.onChange(value)
                    }}
                  />
                )}
              />
            </div>
          </div>

          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-5">
            <div className="sm:basis-1/5"></div>
            <div className="sm:basis-4/5">
              <Button
                className="py-2 rounded-md bg-primary px-6 text-center text-sm text-white font-bold hover:opacity-70 duration-300"
                type="submit"
                isLoading={updateProfileMutation.isPending}
                disabled={updateProfileMutation.isPending}
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:border-l md:border-gray-200 md:pl-6 xl:pl-8">
          <div className="flex flex-col items-center">
            <div className="my-5 h-24 w-24 overflow-hidden rounded-full">
              <img
                src={previewImage || avatar}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <InputFile onChange={handleChangeFile} />

            <div className="mt-3">
              <p>Dụng lượng file tối đa 500 KB</p>
              <p>Định dạng: .JPEG, .PNG</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Profile
