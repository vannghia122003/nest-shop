import { IconStarFilled } from '@tabler/icons-react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useState } from 'react'
import { createSearchParams, useLocation, useSearchParams } from 'react-router-dom'

import { productApi } from '@/api'
import AutoPagination from '@/components/auto-pagination'
import RatingStar from '@/components/rating-star'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/helper'
import QUERY_KEY from '@/utils/query-key'

interface IProps {
  productRating: number
  productId: number
}

const ratingArr = [
  { label: 'All', value: null },
  { label: '1 Star', value: 1 },
  { label: '2 Star', value: 2 },
  { label: '3 Star', value: 3 },
  { label: '4 Star', value: 4 },
  { label: '5 Star', value: 5 }
]

function ProductRating({ productRating, productId }: IProps) {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [rating, setRating] = useState<number | null>(null)
  const page = Number(searchParams.get('page')) || 1
  const { data: reviewsData } = useQuery({
    queryKey: [QUERY_KEY.REVIEWS, productId, page, rating],
    queryFn: () =>
      productApi.getAllReviews({
        productId,
        params: { limit: 5, page, searchBy: 'rating', search: rating ? String(rating) : undefined }
      }),
    placeholderData: keepPreviousData
  })

  const handleChangeRating = (rating: number | null) => {
    setRating(rating)
    setSearchParams(createSearchParams(), { preventScrollReset: true })
  }

  return (
    <div>
      <div className="border border-primary bg-primary/10 p-4">
        <div className="flex flex-col items-center justify-between gap-2">
          <div className="text-center text-primary">
            <div>
              <span className="text-3xl">{productRating}</span>
              <span className="ml-1 text-lg">out of 5</span>
            </div>
            <div className="mt-1 flex">
              <IconStarFilled />
              <IconStarFilled />
              <IconStarFilled />
              <IconStarFilled />
              <IconStarFilled />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {ratingArr.map((item) => (
              <Button
                key={item.value}
                variant="outline"
                className={cn(
                  'min-w-[80px] font-normal',
                  item.value === rating && 'border-primary'
                )}
                onClick={() => handleChangeRating(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {reviewsData && reviewsData.data.data.length > 0 && (
        <div className="mt-6 flex flex-col gap-8">
          {reviewsData.data.data.map((review) => (
            <div className="flex items-start gap-4" key={review.id}>
              <Avatar className="size-10">
                <AvatarImage src={review.user.avatar ?? ''} alt={review.user.name.slice(0, 2)} />
                <AvatarFallback>{review.user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{review.user.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(review.createdAt), 'H:mm dd/MM/yyyy')}
                  </div>
                </div>
                <RatingStar rating={review.rating} size={14} />
                <div>{review.comment}</div>
                {review.photos.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {review.photos.map((photo) => (
                      <img key={photo.id} src={photo.url} className="size-[70px] object-cover" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {reviewsData && reviewsData.data.meta.totalPages > 0 && (
        <div className="mt-6">
          <AutoPagination
            preventScrollReset
            page={reviewsData.data.meta.currentPage}
            pathname={location.pathname}
            pageSize={reviewsData.data.meta.totalPages}
            queryParams={{}}
          />
        </div>
      )}
    </div>
  )
}

export default ProductRating
