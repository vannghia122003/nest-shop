import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { TbMoneybag } from 'react-icons/tb'
import { Link, createSearchParams } from 'react-router-dom'
import orderApi from '~/apis/order.api'
import Images from '~/constants/images'
import { orderStatus } from '~/constants/order'
import path from '~/constants/path'
import { useQueryParams } from '~/hooks'
import { OrderStatus } from '~/types/order.type'
import { convertISOString, formatCurrency, generateNameId } from '~/utils/helpers'

const tabList = [
  { status: orderStatus.all, name: 'Tất cả' },
  { status: orderStatus.processing, name: 'Chờ xác nhận' },
  { status: orderStatus.shipping, name: 'Đang giao' },
  { status: orderStatus.completed, name: 'Đã giao' },
  { status: orderStatus.cancelled, name: 'Đã hủy' }
]

function Order() {
  const queryParams: { status?: string } = useQueryParams()
  const status = isNaN(Number(queryParams.status)) ? orderStatus.all : Number(queryParams.status)
  const { data: ordersData } = useQuery({
    queryKey: ['purchases', status],
    queryFn: () => orderApi.getUserOrders({ status: status as OrderStatus })
  })
  const orders = ordersData?.result

  const renderStatusLabel = (status: OrderStatus) => {
    if (status === orderStatus.processing) return 'Chờ xác nhận'
    if (status === orderStatus.shipping) return 'Đang giao'
    if (status === orderStatus.completed) return 'Đã giao'
    if (status === orderStatus.cancelled) return 'Đã hủy'
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="sticky top-0 flex bg-white shadow-sm">
            {tabList.map((tab) => (
              <Link
                key={tab.status}
                title={tab.name}
                to={{
                  pathname: path.order,
                  search: createSearchParams({ status: String(tab.status) }).toString()
                }}
                className={clsx(
                  'flex flex-1 items-center justify-center border-b-2 px-2 py-4 text-secondary',
                  { 'border-b-primary text-primary': status === tab.status }
                )}
              >
                {tab.name}
              </Link>
            ))}
          </div>
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <div className="bg-white mt-3 p-6 shadow" key={order._id}>
                <div className="mb-4 flex justify-between items-center">
                  <p className="font-bold">{convertISOString(order.order_date)}</p>
                  <p className="text-primary">{renderStatusLabel(order.status)?.toUpperCase()}</p>
                </div>
                <div>
                  {order.products.map((product) => (
                    <div
                      key={product.product_id}
                      className="rounded-sm py-3 text-secondary border-t last:border-b"
                    >
                      <Link
                        to={`${path.productDetail}${generateNameId({
                          name: product.product_detail.name,
                          id: product.product_id
                        })}`}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={product.product_detail.image}
                            alt={product.product_detail.name}
                            className="h-20 w-20 border border-gray-300 object-cover"
                          />
                        </div>
                        <div className="ml-3 flex-grow overflow-hidden">
                          <div className="font-bold">{product.product_detail.name}</div>
                          <div className="mt-3">x{product.buy_count}</div>
                        </div>
                        <div className="ml-3 flex-shrink-0 text-primary truncate text-lg">
                          {formatCurrency(product.product_detail.price)}₫
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end items-center pt-6 text-secondary">
                  <span className="text-xl mr-1">
                    <TbMoneybag />
                  </span>
                  <p className="text-lg">
                    Thành tiền:{' '}
                    <span className="text-primary text-xl font-medium">
                      {formatCurrency(order.total_price)}₫
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="mt-4 flex h-[600px] flex-col items-center justify-center gap-5 bg-white">
              <img
                className="h-[100px] w-[100px] object-cover"
                src={Images.NO_PURCHASE}
                alt="no purchase"
              />
              <p className="text-secondary">Chưa có đơn hàng</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Order
