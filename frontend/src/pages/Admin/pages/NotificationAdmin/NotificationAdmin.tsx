import {
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions
} from '@floating-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { Button as ButtonFlowBite, Flowbite, Table } from 'flowbite-react'
import { ChangeEvent, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaGrin, FaTrashAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import notificationApi from '~/apis/notification.api'
import userApi from '~/apis/user.api'
import Button from '~/components/Button'
import ConfirmModal from '~/components/ConfirmModal'
import Input from '~/components/Input'
import { customTheme } from '~/types/custom.type'
import { ErrorResponse } from '~/types/response.type'
import { isUnprocessableEntity } from '~/utils/errors'
import { convertISOString } from '~/utils/helpers'
import { socket } from '~/utils/socket'
import InputFile from '../../components/InputFile'
import QUERY_KEYS from '~/constants/keys'

const notificationSchema = yup.object({
  title: yup.string().required('Nhập tiêu đề thông báo'),
  content: yup
    .string()
    .required('Nhập nội dung thông báo')
    .min(10, 'Nội dung thông báo ít nhất 10 kí tự'),
  image: yup.string().required('Chọn ảnh của danh mục')
})
type FormData = yup.InferType<typeof notificationSchema>

function NotificationAdmin() {
  const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false)
  const [deletingNotificationId, setDeletingNotificationId] = useState('')
  const [image, setImage] = useState<File>()
  const form = useForm<FormData>({
    resolver: yupResolver(notificationSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  })
  const {
    register,
    getValues,
    setValue,
    clearErrors,
    reset,
    formState: { errors }
  } = form
  const [showPicker, setShowPicker] = useState(false)
  const { refs, context } = useFloating({
    open: showPicker,
    onOpenChange: setShowPicker,
    middleware: [offset(2), flip(), shift()]
  })
  const click = useClick(context, { toggle: false })
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  const { data: notificationData, refetch } = useQuery({
    queryKey: [QUERY_KEYS.NOTIFICATIONS],
    queryFn: notificationApi.getNotifications,
    staleTime: 5 * 60 * 1000
  })
  const uploadImageMutation = useMutation({ mutationFn: userApi.uploadImage })
  const createNotificationMutation = useMutation({ mutationFn: notificationApi.createNotification })
  const deleteNotificationMutation = useMutation({ mutationFn: notificationApi.deleteNotification })
  const isPending = uploadImageMutation.isPending || createNotificationMutation.isPending

  const handleChangeContent = (event: ChangeEvent<HTMLTextAreaElement>) => {
    clearErrors('content')
    register('content').onChange(event)
  }
  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    const value = getValues('content')
    const emoji = emojiObject.emoji
    clearErrors('content')
    setValue('content', value + emoji)
  }

  const handleSubmit = form.handleSubmit(async (data: FormData) => {
    try {
      if (image) {
        const formData = new FormData()
        formData.append('image', image)
        const res = await uploadImageMutation.mutateAsync(formData)
        form.setValue('image', res.result[0])
      }
      const res = await createNotificationMutation.mutateAsync(data)
      toast.success(res.message)
      reset()
      refetch()
      socket.emit('send_notification')
    } catch (error) {
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

  const handleDeleteNotification = (notificationId: string) => {
    setOpenModalConfirm(true)
    setDeletingNotificationId(notificationId)
  }

  const handleConfirmDeleteNotification = () => {
    if (deletingNotificationId) {
      deleteNotificationMutation.mutate(deletingNotificationId, {
        onSuccess: () => {
          setOpenModalConfirm(false)
          setDeletingNotificationId('')
          refetch()
        }
      })
    }
  }

  return (
    <div className="p-6 bg-white shadow">
      <h2 className="text-secondary text-3xl mb-4">Tạo thông báo</h2>
      <form className="text-secondary mb-6" onSubmit={handleSubmit} autoComplete="off">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 xl:gap-10">
          <div>
            <div className="mb-1">Tiêu đề</div>
            <Input
              className="w-full"
              name="title"
              formObj={form}
              placeholder="Nhập tiêu đề thông báo"
            />
            <div className="mb-1 mt-2">Ảnh</div>
            <Controller
              control={form.control}
              name="image"
              render={({ field }) => (
                <InputFile
                  value={field.value ? [field.value] : []}
                  className="w-full"
                  errorMessage={form.formState.errors.image?.message}
                  onChange={(files, previewImages) => {
                    form.clearErrors('image')
                    field.onChange(previewImages[0])
                    setImage(files[0])
                  }}
                />
              )}
            />
          </div>
          <div>
            <div className="mb-1">Nội dung</div>
            <div className="relative">
              <textarea
                {...register('content')}
                className={clsx(
                  'px-3 py-2 w-full rounded-md border outline-none resize-none h-[146px]',
                  {
                    'border-red-600 bg-red-50': errors.content?.message,
                    'border-gray-300 focus:border-primary shadow bg-gray-50':
                      !errors.content?.message
                  }
                )}
                placeholder="Viết nội dung thông báo..."
                onChange={handleChangeContent}
              />
              <div ref={refs.setReference} {...getReferenceProps()}>
                <button type="button" className="absolute right-1 bottom-2 text-xl cursor-pointer">
                  <FaGrin />
                </button>
                {showPicker && (
                  <div
                    ref={refs.setFloating}
                    {...getFloatingProps()}
                    className="absolute top-full right-1/2 translate-x-1/2 xs:right-0 xs:translate-x-0 z-10"
                  >
                    <EmojiPicker
                      previewConfig={{ showPreview: false }}
                      lazyLoadEmojis
                      height={400}
                      width={350}
                      onEmojiClick={handleEmojiClick}
                    />
                  </div>
                )}
              </div>
            </div>
            <p className="mt-1 text-red-600 text-sm min-h-[1.25rem]">{errors.content?.message}</p>
          </div>
        </div>
        <Button
          isLoading={isPending}
          disabled={isPending}
          className="bg-secondary text-white px-6 py-3 rounded-md hover:opacity-80 font-bold mt-2"
        >
          Tạo
        </Button>
      </form>
      <div className="overflow-x-auto">
        <div className="min-w-[1280px]">
          <Flowbite theme={{ theme: customTheme }}>
            <Table hoverable className="border border-gray-300">
              <Table.Head>
                <Table.HeadCell>Tiêu đề</Table.HeadCell>
                <Table.HeadCell className="w-[110px]">Ảnh</Table.HeadCell>
                <Table.HeadCell>Nội dung</Table.HeadCell>
                <Table.HeadCell className="whitespace-nowrap">Người tạo</Table.HeadCell>
                <Table.HeadCell>Ngày tạo</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {notificationData &&
                  notificationData.result.map((notification) => (
                    <Table.Row className="bg-white" key={notification._id}>
                      <Table.Cell>{notification.title}</Table.Cell>
                      <Table.Cell className="py-0">
                        <img
                          className="w-[60px] h-[60px]"
                          src={notification.image}
                          alt={notification.title}
                        />
                      </Table.Cell>
                      <Table.Cell>{notification.content}</Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        {notification.created_by.name}
                      </Table.Cell>
                      <Table.Cell className="whitespace-nowrap">
                        {convertISOString(notification.created_at)}
                      </Table.Cell>
                      <Table.Cell>
                        <ButtonFlowBite
                          color="red"
                          size="xs"
                          onClick={() => handleDeleteNotification(notification._id)}
                          title="Xoá"
                        >
                          <span className="text-lg">
                            <FaTrashAlt />
                          </span>
                        </ButtonFlowBite>
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </Flowbite>
        </div>
        <ConfirmModal
          description="Bạn có chắc chắn muốn xóa danh mục này không?"
          openModal={openModalConfirm}
          onCloseModal={() => {
            setOpenModalConfirm(false)
            setDeletingNotificationId('')
          }}
          onConfirm={handleConfirmDeleteNotification}
          isLoading={deleteNotificationMutation.isPending}
        />
      </div>
    </div>
  )
}
export default NotificationAdmin
