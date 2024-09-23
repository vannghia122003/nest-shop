import { IconShoppingCart } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { cartApi } from '@/api'
import { useAppContext } from '@/contexts/app-provider'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { formatCurrency, generateNameId } from '@/utils/helper'
import IMAGES from '@/utils/images'
import PATH from '@/utils/path'
import QUERY_KEY from '@/utils/query-key'

function HeaderCart() {
  const { isAuthenticated } = useAppContext()
  const { data } = useQuery({
    queryKey: [QUERY_KEY.CART],
    queryFn: cartApi.getCart,
    enabled: isAuthenticated
  })
  const cart = data?.data ?? []

  return (
    <HoverCard openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <Button variant="ghost" asChild>
          <Link to={PATH.CART} className="!p-2">
            <div className="relative">
              {cart.length > 0 && (
                <span className="absolute -right-1 -top-2 size-4 rounded-full bg-red-500 text-center leading-4 text-white">
                  {cart.length}
                </span>
              )}
              <IconShoppingCart />
            </div>
            <span className="ml-1 hidden lg:inline">Cart</span>
          </Link>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        sideOffset={0}
        className="relative min-w-[300px] max-w-[350px] p-2 xs:max-w-[400px]"
      >
        {cart.length > 0 ? (
          <div>
            <div className="max-h-[50vh] overflow-y-auto">
              {cart.map((cartItem) => (
                <Button variant="ghost" asChild key={cartItem.product.id}>
                  <Link
                    to={`${PATH.PRODUCT_LIST}/${generateNameId({
                      name: cartItem.product.name,
                      id: cartItem.product.id
                    })}`}
                    className="!flex h-auto !items-start !px-2"
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="size-16 border border-gray-300 object-cover"
                        src={cartItem.product.thumbnail}
                        alt={cartItem.product.name}
                      />
                    </div>
                    <div className="ml-2 flex-grow overflow-hidden">
                      <p className="truncate font-medium text-primary">{cartItem.product.name}</p>
                      <span>
                        {cartItem.quantity} x {formatCurrency(cartItem.product.price)}
                      </span>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
            <div className="my-1 border-t-2 border-gray-200"></div>
            <div className="flex items-center justify-end p-2">
              <Button asChild>
                <Link to={PATH.CART}>View cart</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-16">
            <img
              className="mx-auto h-[120px] w-[302px] object-cover"
              src={IMAGES.EMPTY_CART}
              alt="empty cart"
            />
            <p className="mt-1 text-center">No products yet</p>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
export default HeaderCart
