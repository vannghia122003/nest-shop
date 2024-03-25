import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import DOMPurify from 'dompurify'
import { convert } from 'html-to-text'
import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FaCartPlus, FaRegCommentDots, FaRegEye, FaRegMoneyBillAlt } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import cartApi from '~/apis/cart.api'
import productApi from '~/apis/product.api'
import Button from '~/components/Button'
import ProductRating from '~/components/ProductRating'
import QuantityController from '~/components/QuantityController'
import { isUnauthorizedError } from '~/utils/errors'
import { formatCurrency, formatNumberToCompactStyle, getIdFromNameId } from '~/utils/helpers'
import { ProductImage, ReviewInput, ReviewList } from '.'
import { socket } from '~/utils/socket'
import QUERY_KEYS from '~/constants/keys'

function ProductDetail() {
  const queryClient = useQueryClient()
  const { nameId } = useParams()
  const product_id = getIdFromNameId(nameId as string)
  const [buyCount, setBuyCount] = useState(1)
  const { data: productDetailData } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_DETAIL, product_id],
    queryFn: () => productApi.getProductDetail(product_id)
  })
  const product = productDetailData?.result
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const addToCartMutation = useMutation({ mutationFn: cartApi.addToCart })
  const [isTypingReview, setIsTypingReview] = useState(false)

  const handleInvalidateQueries = useCallback(() => {
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCT_DETAIL] }),
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEWS] })
    ])
  }, [queryClient])

  const handleTypingReview = () => setIsTypingReview(true)

  const handleTypingReviewFinish = () => setIsTypingReview(false)

  /* handle socket */
  useEffect(() => {
    socket.emit('join_product_room', product_id)
    socket.on('add_review', handleInvalidateQueries)
    socket.on('update_review', handleInvalidateQueries)
    socket.on('delete_review', handleInvalidateQueries)
    socket.on('typing_review', handleTypingReview)
    socket.on('review_empty', handleTypingReviewFinish)

    return () => {
      socket.off('add_review', handleInvalidateQueries)
      socket.off('update_review', handleInvalidateQueries)
      socket.off('delete_review', handleInvalidateQueries)
      socket.off('typing_review', handleTypingReview)
      socket.off('review_empty', handleTypingReviewFinish)
    }
  }, [handleInvalidateQueries, product_id])
  /* end handle socket  */

  const addToCart = () => {
    addToCartMutation.mutate(
      {
        product_id: product?._id as string,
        buy_count: buyCount
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] })
          toast.success(data.message)
        },
        onError: (error) => {
          if (isUnauthorizedError(error)) {
            toast.error('Vui lòng đăng nhập')
          }
        }
      }
    )
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  if (!product) return null

  return (
    <div className="bg-[#f5f5f5] py-6">
      <Helmet>
        <title>{product.name} | Nest Shop</title>
        <meta name="description" content={convert(product.description)} />
      </Helmet>
      <div className="container">
        <div className="grid grid-cols-12 gap-5 rounded-md border border-[#ececec] bg-white p-4 shadow xs:p-8 md:p-4 lg:p-5 xl:gap-8">
          <div className="col-span-12 select-none md:col-span-6 lg:col-span-5">
            <ProductImage product={product} />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-7">
            <h1 className="text-3xl font-bold text-secondary">{product.name}</h1>
            <div className="mt-2 flex flex-wrap items-center text-base text-secondary xs:flex-nowrap">
              <div className="flex basis-1/2 items-center gap-1 xs:basis-auto">
                <ProductRating rating={product.rating} />
                <span>({product.rating})</span>
              </div>
              <div className="mx-3 hidden h-5 w-[1px] bg-gray-300 xs:block xl:mx-4"></div>
              <div className="flex basis-1/2 items-center gap-1 xs:basis-auto">
                <span className="text-xl">
                  <FaRegEye />
                </span>
                <p>
                  {formatNumberToCompactStyle(product.view)}{' '}
                  <span className="xs:hidden lg:inline">Lượt xem</span>
                </p>
              </div>
              <div className="mx-3 hidden h-5 w-[1px] bg-gray-300 xs:block xl:mx-4"></div>
              <div className="flex basis-1/2 items-center gap-1 xs:basis-auto">
                <span className="text-xl">
                  <FaRegMoneyBillAlt />
                </span>
                <p>
                  {formatNumberToCompactStyle(product.sold)}{' '}
                  <span className="xs:hidden lg:inline">Đã bán</span>
                </p>
              </div>
              <div className="mx-3 hidden h-5 w-[1px] bg-gray-300 xs:block xl:mx-4"></div>
              <div className="flex basis-1/2 items-center gap-1 xs:basis-auto">
                <span className="text-xl">
                  <FaRegCommentDots />
                </span>
                <p>
                  {formatNumberToCompactStyle(product.review)}{' '}
                  <span className="xs:hidden lg:inline">Đánh giá</span>
                </p>
              </div>
            </div>

            <p className="mt-6 text-5xl font-bold text-primary">{formatCurrency(product.price)}₫</p>

            <div className="mt-6 flex items-center gap-5">
              <QuantityController
                max={product.quantity}
                value={buyCount}
                onDecrease={handleBuyCount}
                onIncrease={handleBuyCount}
                onType={handleBuyCount}
              />
              <p className="text-secondary">{product.quantity} sản phẩm có sẵn</p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Button
                disabled={product.quantity <= 0}
                className={clsx(
                  'flex min-w-[211px] items-center justify-center gap-2 rounded border border-primary bg-primary/10 px-5 py-3 text-primary shadow',
                  {
                    'hover:bg-primary/5': product.quantity > 0
                  }
                )}
                onClick={addToCart}
              >
                <span className="text-xl">
                  <FaCartPlus />
                </span>
                <span>Thêm vào giỏ hàng</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-md border border-[#ececec] bg-white p-4 shadow lg:p-5">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-secondary">Chi tiết sản phẩm</h2>
            <div className="mt-2 md:pl-6">
              {product.attributes.map((attribute) => (
                <div key={attribute.key} className="flex gap-3 text-sm mb-2">
                  <div className="w-[130px] truncate text-[#0006]">{attribute.key}</div>
                  <div className="text-secondary">{attribute.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-secondary">Mô tả sản phẩm</h2>
            <div className="mt-2 text-sm leading-loose md:pl-6">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.description)
                }}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-md border border-[#ececec] bg-white p-4 shadow lg:p-5">
          <h2 className="text-2xl font-bold text-secondary">Đánh giá sản phẩm</h2>
          <ReviewInput
            product_id={product_id}
            editingReviewId={editingReviewId}
            setEditingReviewId={setEditingReviewId}
          />
          <ReviewList
            product_id={product_id}
            setEditingReviewId={setEditingReviewId}
            isTypingReview={isTypingReview}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
