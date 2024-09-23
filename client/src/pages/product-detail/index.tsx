import { IconEye, IconMoneybag, IconShoppingCartPlus } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { cartApi, productApi } from '@/api'
import QuantityInput from '@/components/quantity-input'
import RatingStar from '@/components/rating-star'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppContext } from '@/contexts/app-provider'
import ProductImage from '@/pages/product-detail/product-image'
import ProductRating from '@/pages/product-detail/product-rating'
import ReviewForm from '@/pages/product-detail/review-form'
import { isUnauthorizedError } from '@/utils/error'
import { formatCurrency, formatNumberToCompactStyle, getIdFromNameId } from '@/utils/helper'
import PATH from '@/utils/path'
import QUERY_KEY from '@/utils/query-key'

function ProductDetail() {
  const { isAuthenticated } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()
  const { nameId } = useParams()
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1)
  const productId = Number(getIdFromNameId(nameId as string))
  const addToCartMutation = useMutation({ mutationFn: cartApi.addToCart })
  const { data: productDetailData } = useQuery({
    queryKey: [QUERY_KEY.PRODUCT_DETAIL, productId],
    queryFn: () => productApi.getProductById(productId)
  })
  const product = productDetailData?.data

  const handleChangeQuantity = (value: number) => {
    setQuantity(value)
  }

  const handleAddToCart = async () => {
    try {
      const res = await addToCartMutation.mutateAsync({ productId, quantity })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CART] })
      toast.success(res.message)
    } catch (error) {
      if (isUnauthorizedError(error)) {
        navigate(`${PATH.LOGIN}?redirectUrl=${location.pathname}`)
      }
    }
  }

  if (!product) return null

  return (
    <div className="container">
      <Helmet>
        <title>{product.name} | Nest Shop</title>
        <meta name="description" content={product.name} />
      </Helmet>
      <Card className="my-4">
        <CardContent className="grid grid-cols-12 gap-5 pt-6">
          <div className="col-span-12 select-none md:col-span-6 lg:col-span-5">
            <ProductImage product={product} />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-7">
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <div className="mt-2 flex flex-wrap items-center text-base xs:flex-nowrap">
              <div className="flex basis-1/2 items-center gap-1 xs:basis-auto">
                <RatingStar rating={product.rating} />
                <span>({product.rating})</span>
              </div>
              <div className="mx-3 hidden h-5 w-[1px] bg-gray-300 xs:block xl:mx-4"></div>
              <div className="flex basis-1/2 items-center gap-1 xs:basis-auto">
                <span className="text-xl">
                  <IconEye />
                </span>
                <div>
                  {formatNumberToCompactStyle(product.view)}{' '}
                  <span className="xs:hidden lg:inline">View</span>
                </div>
              </div>
              <div className="mx-3 hidden h-5 w-[1px] bg-gray-300 xs:block xl:mx-4"></div>
              <div className="flex basis-1/2 items-center gap-1 xs:basis-auto">
                <span className="text-xl">
                  <IconMoneybag />
                </span>
                <p>
                  {formatNumberToCompactStyle(product.sold)}{' '}
                  <span className="xs:hidden lg:inline">Sold</span>
                </p>
              </div>
            </div>
            <div className="mt-6 text-4xl font-bold text-primary">
              <span>{formatCurrency((product.price * (100 - product.discount)) / 100)}₫</span>
              {product.discount > 0 && (
                <Badge variant="secondary" className="ml-4 bg-primary/20 px-2 py-0 text-xs">
                  -{product.discount}%
                </Badge>
              )}
            </div>
            <div className="mt-6 flex items-center gap-5">
              <QuantityInput
                max={product.stock}
                value={quantity}
                onDecrease={handleChangeQuantity}
                onIncrease={handleChangeQuantity}
                onType={handleChangeQuantity}
              />
              <p>{product.stock} available</p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Button
                size="lg"
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
                leftSection={<IconShoppingCartPlus />}
              >
                Add to cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {product.specifications.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-2xl">Product Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            {product.specifications.map((specification) => (
              <div key={specification.key} className="mb-2 flex gap-3 text-sm">
                <div className="w-[130px] truncate font-semibold text-secondary-foreground">
                  {specification.key}
                </div>
                <div className="text-secondary-foreground">{specification.value}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-2xl">Product Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose mt-2 max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <p className="text-2xl">Product Ratings</p>
            {isAuthenticated && <ReviewForm productId={productId} />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductRating productId={productId} productRating={product.rating} />
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductDetail
