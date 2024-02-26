import { Link } from 'react-router-dom'
import Popover from '~/components/Popover'
import Images from '~/constants/images'
import path from '~/constants/path'
import { ProductLineItem } from '~/types/product.type'
import { formatCurrency, generateNameId } from '~/utils/helpers'

interface Props {
  productsInCart: ProductLineItem[]
}

function Cart({ productsInCart }: Props) {
  return (
    <Popover
      placement="bottom"
      renderPopover={
        <div className="min-w-[300px] max-w-[350px] xs:max-w-[400px] rounded-sm bg-white shadow-md">
          {productsInCart.length > 0 ? (
            <div>
              <h4 className="p-3">Sản phẩm đã thêm</h4>
              <div className="max-h-[50vh] overflow-y-auto">
                {productsInCart.map((product) => (
                  <Link
                    to={`${path.productList}/${generateNameId({
                      name: product.product_detail.name,
                      id: product.product_id
                    })}`}
                    className="flex px-3 py-2 hover:bg-gray-100"
                    key={product.product_id}
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="h-20 w-20 border border-gray-300 object-cover"
                        src={product.product_detail.image}
                        alt={product.product_detail.name}
                      />
                    </div>
                    <div className="ml-2 flex-grow overflow-hidden">
                      <p className="my-2 truncate font-medium text-primary">
                        {product.product_detail.name}
                      </p>
                      <span>
                        {product.buy_count} x {formatCurrency(product.product_detail.price)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="px-3 pb-6 pt-4">
                <div className="mb-4 border-t-2 border-gray-200"></div>
                <div className="flex items-center justify-end">
                  <Link
                    to={path.cart}
                    className="rounded bg-primary px-4 py-2 text-white duration-300 hover:bg-[#29A56C]"
                  >
                    Xem giỏ hàng
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16">
              <img
                className="mx-auto h-[120px] w-[302px] object-cover"
                src={Images.EMPTY_CART}
                alt="empty cart"
              />
              <p className="mt-1 text-center">Chưa có sản phẩm</p>
            </div>
          )}
        </div>
      }
    >
      <Link to={path.cart} className="group flex items-center p-1 text-white hover:opacity-70">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          {productsInCart.length > 0 && (
            <span className="absolute -right-1 -top-2 rounded-lg bg-white px-1 text-xs text-primary">
              {productsInCart.length}
            </span>
          )}
        </div>
        <span className="ml-1 hidden whitespace-nowrap lg:block">Giỏ hàng</span>
      </Link>
    </Popover>
  )
}
export default Cart
