import { zodResolver } from '@hookform/resolvers/zod'
import { IconStarFilled } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { fileApi, productApi } from '@/api'
import FormDialog from '@/components/form-dialog'
import FormFileUpload from '@/components/form-input/form-file-upload'
import FormText from '@/components/form-input/form-text'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ICreateReviewBody } from '@/types/product'
import { cn, handleUnprocessableEntityError } from '@/utils/helper'
import QUERY_KEY from '@/utils/query-key'

const schema = z.object({
  rating: z.number({ message: 'Rating is required' }).int().positive().lte(5),
  comment: z.string().min(1, { message: 'Comment is required' }).min(5),
  photos: z.array(z.string().url())
})
type FormData = z.infer<typeof schema>

interface IProps {
  productId: number
}

function ReviewForm({ productId }: IProps) {
  const queryClient = useQueryClient()
  const [rating, setRating] = useState<number>(0)
  const [open, setOpen] = useState<boolean>(false)
  const [filePhotos, setFilePhotos] = useState<File[] | null>(null)
  const uploadImageMutation = useMutation({ mutationFn: fileApi.uploadImage })
  const createReviewMutation = useMutation({ mutationFn: productApi.createReview })
  const isPending = uploadImageMutation.isPending || createReviewMutation.isPending
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      comment: '',
      rating: undefined,
      photos: []
    }
  })

  const handleOpenChangeDialog = (open: boolean) => {
    setOpen(open)
    form.reset()
    setRating(0)
    setFilePhotos(null)
  }

  const handleMouseRating = (action: 'enter' | 'leave', rating: number) => () => {
    if (form.getValues('rating') > 0) return
    if (action === 'enter') setRating(rating)
    if (action === 'leave') setRating(0)
  }

  const handleRating = (rating: number) => {
    form.clearErrors('rating')
    setRating(rating)
    form.setValue('rating', rating)
  }

  const handleFileChange = (files: File[], previews: string[]) => {
    setFilePhotos(files)
    form.setValue('photos', previews)
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    const body: ICreateReviewBody = { ...data }
    try {
      if (filePhotos) {
        const formData = new FormData()
        filePhotos.forEach((file) => {
          formData.append('images', file)
        })
        const res = await uploadImageMutation.mutateAsync(formData)
        body.photos = res.data
      }
      await createReviewMutation.mutateAsync({ productId, body })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.REVIEWS] })
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.PRODUCT_DETAIL] })
      setOpen(false)
    } catch (error) {
      handleUnprocessableEntityError(error, form.setError)
    }
  })

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChangeDialog}
      title="Submit your review"
      btnTrigger={<Button>Submit your review</Button>}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium leading-none">Rating</div>
                <div>
                  <div className="flex gap-1">
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={index}
                          onMouseEnter={handleMouseRating('enter', index + 1)}
                          onMouseLeave={handleMouseRating('leave', index + 1)}
                          onClick={() => handleRating(index + 1)}
                          className={cn(
                            'inline-block cursor-pointer rounded-sm bg-gray-200 p-1 text-white',
                            index + 1 <= rating && 'text-yellow-400'
                          )}
                        >
                          <IconStarFilled size={20} />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {form.formState.errors.rating && (
                <p className="mt-2 text-[0.8rem] font-medium text-destructive">
                  {form.formState.errors.rating.message}
                </p>
              )}
            </div>
            <FormText
              form={form}
              type="textarea"
              name="comment"
              label="Comment"
              placeholder="Enter your comment"
            />
            <FormFileUpload
              form={form}
              multiple
              name="photos"
              label="Photos"
              onChange={handleFileChange}
            />
          </div>
          <Button type="submit" className="mt-5" loading={isPending}>
            Submit
          </Button>
        </form>
      </Form>
    </FormDialog>
  )
}
export default ReviewForm
