import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Dispatch, useCallback, useEffect, useState } from 'react'
import { FaEllipsisV, FaRegClock } from 'react-icons/fa'
import productApi from '~/apis/product.api'
import ConfirmModal from '~/components/ConfirmModal'
import Pagination from '~/components/Pagination'
import ProductRating from '~/components/ProductRating'
import { ReviewListQuery } from '~/types/review.type'
import { convertISOString } from '~/utils/helpers'
import { socket } from '~/utils/socket'

interface Props {
  product_id: string
  setEditingReviewId: Dispatch<React.SetStateAction<string | null>>
  isTypingReview: boolean
}
interface PopoverStates {
  [key: string]: boolean
}

function ReviewList({ product_id, setEditingReviewId, isTypingReview }: Props) {
  const queryClient = useQueryClient()
  const [pagination, setPagination] = useState<ReviewListQuery>({ limit: 5, page: 1 })
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', pagination],
    queryFn: () => productApi.getReviews({ product_id, params: pagination }),
    placeholderData: keepPreviousData
  })
  const deleteReviewMutation = useMutation({ mutationFn: productApi.deleteReview })
  const reviewList = reviewsData?.result
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [popoverStates, setPopoverStates] = useState<PopoverStates>({})

  useEffect(() => {
    setPopoverStates(
      reviewList?.reduce<PopoverStates>((obj, review) => {
        obj[review._id] = false
        return obj
      }, {}) || {}
    )
  }, [reviewList])

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page })
  }

  const handleClosePopover = useCallback(() => {
    const newPopoverStates: PopoverStates = {}
    for (const [key] of Object.entries(popoverStates)) {
      newPopoverStates[key] = false
    }
    setPopoverStates(newPopoverStates)
  }, [popoverStates])

  useEffect(() => {
    setTimeout(() => {
      if (Object.entries(popoverStates).some((arr) => arr[1])) {
        window.addEventListener('click', handleClosePopover)
      } else {
        window.removeEventListener('click', handleClosePopover)
      }
    }, 0)
    return () => {
      window.removeEventListener('click', handleClosePopover)
    }
  }, [handleClosePopover, popoverStates])

  const handleShowPopover = (review_id: string) => {
    setPopoverStates({
      ...popoverStates,
      [review_id]: true
    })
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    localStorage.removeItem('review_id')
  }

  const handleEditReview = (review_id: string) => {
    setEditingReviewId(review_id)
  }

  const handleDeleteReview = (review_id: string) => {
    setOpenModal(true)
    localStorage.setItem('review_id', review_id)
  }

  const handleConfirmDeleteReview = () => {
    const review_id = localStorage.getItem('review_id') as string
    deleteReviewMutation.mutate(
      { product_id, review_id },
      {
        onSuccess: () => {
          setOpenModal(false)
          queryClient.invalidateQueries({ queryKey: ['reviews'] })
          localStorage.removeItem('review_id')
          socket.emit('delete_review')
        }
      }
    )
  }

  return (
    <div className="mt-4">
      {isTypingReview && (
        <div className="px-4 flex gap-1 items-center">
          <p className="mr-2 text-sm text-gray-400">Người dùng đang nhập đánh giá</p>
          <div
            className="w-[6px] h-[6px] bg-gray-400 rounded-full opacity-0 animate-loadingFade"
            style={{ animationDelay: '0' }}
          ></div>
          <div
            className="w-[6px] h-[6px] bg-gray-400 rounded-full opacity-0 animate-loadingFade"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-[6px] h-[6px] bg-gray-400 rounded-full opacity-0 animate-loadingFade"
            style={{ animationDelay: '0.4s' }}
          ></div>
        </div>
      )}
      {reviewsData &&
        reviewsData.result.map((review) => (
          <div className="p-4 border-b border-gray-300" key={review._id}>
            <div className="flex gap-2 relative mr-4">
              <img
                className="w-[40px] h-[40px] rounded-full"
                src={review.user.avatar}
                alt={review.user.name}
              />
              <div>
                <div className="flex xs:flex-row flex-col gap-1 xs:gap-3">
                  <p className="text-sm text-primary font-bold">{review.user.name}</p>
                  <p className="text-xs flex items-center gap-1">
                    <FaRegClock />
                    <span>{convertISOString(review.review_date)}</span>
                  </p>
                </div>
                <div className="mt-1">
                  <ProductRating rating={review.rating} />
                </div>
                <p className="mt-2 text-secondary">{review.comment}</p>
              </div>
              <div className="absolute top-0 right-0">
                <button
                  className="text-secondary p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => handleShowPopover(review._id)}
                >
                  <FaEllipsisV />
                </button>
                {popoverStates[review._id] && (
                  <div className="absolute top-[calc(100%+5px)] right-0 z-10">
                    <div className="min-w-[120px] rounded-md border border-gray-200 bg-white shadow-md">
                      <button
                        className="hover:bg-gray-100 hover:text-primary px-4 py-3 w-full text-left"
                        onClick={() => handleEditReview(review._id)}
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        className="hover:bg-gray-100 hover:text-primary px-4 py-3 w-full text-left"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      <div className="mt-4">
        <Pagination
          pageCount={reviewsData?.total_pages}
          currentPage={pagination.page}
          onPageChange={handlePageChange}
        />
      </div>
      <ConfirmModal
        description="Bạn có chắc chắn muốn xóa đánh giá này không?"
        openModal={openModal}
        onCloseModal={handleCloseModal}
        onConfirm={handleConfirmDeleteReview}
        isLoading={deleteReviewMutation.isPending}
      />
    </div>
  )
}
export default ReviewList
