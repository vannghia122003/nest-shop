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
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { ChangeEvent, Dispatch, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaGrin, FaStar } from 'react-icons/fa'
import * as yup from 'yup'
import productApi from '~/apis/product.api'
import Button from '~/components/Button'
import QUERY_KEYS from '~/constants/keys'
import { AppContext } from '~/contexts/app.context'
import { socket } from '~/utils/socket'

interface Props {
  product_id: string
  editingReviewId: string | null
  setEditingReviewId: Dispatch<React.SetStateAction<string | null>>
}

const reviewSchema = yup.object({
  rating: yup.number().required('Vui lòng chọn mức độ đánh giá'),
  comment: yup.string().required('Vui lòng nhập đánh giá').min(6, 'Độ dài ít nhất 6 kí tự')
})
type FormData = yup.InferType<typeof reviewSchema>

function ReviewInput({ product_id, editingReviewId, setEditingReviewId }: Props) {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useContext(AppContext)
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(reviewSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  })
  const [rating, setRating] = useState<number>(0)
  const [showPicker, setShowPicker] = useState(false)
  const { refs, context } = useFloating({
    open: showPicker,
    onOpenChange: setShowPicker,
    middleware: [offset(2), flip(), shift()]
  })
  const click = useClick(context, { toggle: false })
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  const createReviewMutation = useMutation({ mutationFn: productApi.createReview })
  const updateReviewMutation = useMutation({ mutationFn: productApi.updateReview })
  const { data: reviewData } = useQuery({
    queryKey: [QUERY_KEYS.REVIEW_DETAIL, editingReviewId],
    queryFn: () =>
      productApi.getReviewDetai({
        product_id,
        review_id: editingReviewId as string
      }),
    enabled: Boolean(editingReviewId),
    placeholderData: keepPreviousData
  })
  const reviewDetail = reviewData?.result
  const isPending = createReviewMutation.isPending || updateReviewMutation.isPending

  useEffect(() => {
    if (editingReviewId) {
      clearErrors()
      setValue('comment', reviewDetail?.comment || '')
      setValue('rating', reviewDetail?.rating || 0)
      setRating(reviewDetail?.rating || 0)
    }
  }, [clearErrors, editingReviewId, reviewDetail, setValue])

  const onSubmit = (data: FormData) => {
    if (!editingReviewId) {
      createReviewMutation.mutate(
        { product_id, data },
        {
          onSuccess: () => {
            reset()
            setRating(0)
            Promise.all([
              queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCT_DETAIL] }),
              queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS] })
            ])
            socket.emit('add_review')
            socket.emit('review_empty')
          }
        }
      )
    } else {
      updateReviewMutation.mutate(
        { product_id, review_id: editingReviewId, data },
        {
          onSuccess: () => {
            reset()
            setRating(0)
            setEditingReviewId(null)
            Promise.all([
              queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCT_DETAIL] }),
              queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS] })
            ])
            socket.emit('update_review')
          }
        }
      )
    }
  }

  const handleMouseRating = (action: 'enter' | 'leave', rating: number) => () => {
    if (getValues('rating') > 0) return
    if (action === 'enter') setRating(rating)
    if (action === 'leave') setRating(0)
  }

  const handleRating = (rating: number) => {
    clearErrors('rating')
    setRating(rating)
    setValue('rating', rating)
  }

  const handleChangeComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
    clearErrors('comment')
    register('comment').onChange(event)
    if (event.target.value) {
      socket.emit('typing_review')
    } else {
      socket.emit('review_empty')
    }
  }

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    const value = getValues('comment')
    const emoji = emojiObject.emoji
    setValue('comment', value + emoji)
  }

  const handleCancelEdit = () => {
    reset()
    setRating(0)
    setEditingReviewId(null)
  }

  return (
    <div className="mt-6 border p-4 bg-gray-100 rounded-md relative">
      <form className="text-secondary" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <div className="flex items-center gap-3">
            <div>Mức độ</div>
            <div className="flex">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <div
                    aria-hidden="true"
                    key={index}
                    className="pr-[2px]"
                    onMouseEnter={handleMouseRating('enter', index + 1)}
                    onMouseLeave={handleMouseRating('leave', index + 1)}
                    onClick={() => handleRating(index + 1)}
                  >
                    <div
                      className={clsx(
                        'p-1 bg-gray-200 inline-block text-white rounded-sm cursor-pointer',
                        { 'text-yellow-400': index + 1 <= rating }
                      )}
                    >
                      <FaStar />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <p className="text-red-600 text-sm min-h-[1.25rem]">{errors.rating?.message}</p>
        </div>
        <div className="mb-2">
          <label htmlFor="message" className="block mb-1 font-medium">
            Đánh giá
          </label>
          <div className="relative">
            <textarea
              {...register('comment')}
              rows={4}
              className={clsx('px-3 py-2 w-full rounded-md border outline-none resize-none', {
                'border-red-600 bg-red-50': errors.comment?.message,
                'border-gray-300 focus:border-primary shadow bg-gray-50': !errors.comment?.message
              })}
              placeholder="Viết đánh giá của bạn..."
              onChange={handleChangeComment}
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
          <p className="mt-1 text-red-600 text-sm min-h-[1.25rem]">{errors.comment?.message}</p>
        </div>
        <div className="flex justify-end gap-2">
          <>
            {editingReviewId && (
              <button
                className="rounded-lg bg-white py-3 text-center font-bold text-secondary border border-gray-300 duration-300 px-4 hover:bg-gray-200"
                type="button"
                onClick={handleCancelEdit}
              >
                Huỷ
              </button>
            )}
            <Button
              type="submit"
              className="rounded-lg bg-secondary py-3 text-center font-bold text-white duration-300 hover:bg-[#29A56C] px-4"
              isLoading={isPending}
              disabled={isPending}
            >
              {editingReviewId ? 'Cập nhật' : 'Gửi đánh giá'}
            </Button>
          </>
        </div>
      </form>
      {!isAuthenticated && (
        <div className="absolute bg-black/30 top-0 right-0 left-0 bottom-0 flex justify-center items-center rounded-md text-xl">
          <span className="text-white font-bold">Vui lòng đăng nhập</span>
        </div>
      )}
    </div>
  )
}
export default ReviewInput
