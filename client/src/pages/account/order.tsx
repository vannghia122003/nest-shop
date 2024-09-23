import { IconMoneybag } from '@tabler/icons-react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import accountApi from '@/api/account-api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OrderStatus } from '@/types/order'
import { formatCurrency, generateNameId } from '@/utils/helper'
import IMAGES from '@/utils/images'
import PATH from '@/utils/path'
import QUERY_KEY from '@/utils/query-key'

function Order() {
  const [orderStatus, setOrderStatus] = useState<OrderStatus | ''>('')
  const { data: ordersData } = useQuery({
    queryKey: [QUERY_KEY.ACCOUNT_ORDER, orderStatus],
    queryFn: () => accountApi.getOrder({ status: orderStatus ? orderStatus : undefined }),
    placeholderData: keepPreviousData
  })
  const orders = ordersData?.data

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Order</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={orderStatus} onValueChange={(value) => setOrderStatus(value as OrderStatus)}>
          <TabsList className="w-full [&>button]:grow">
            <TabsTrigger value="">All</TabsTrigger>
            <TabsTrigger value={OrderStatus.PROCESSING}>Processing</TabsTrigger>
            <TabsTrigger value={OrderStatus.SHIPPING}>Shipping</TabsTrigger>
            <TabsTrigger value={OrderStatus.COMPLETED}>Completed</TabsTrigger>
            <TabsTrigger value={OrderStatus.CANCELLED}>Cancelled</TabsTrigger>
          </TabsList>
          <TabsContent value={orderStatus}>
            {orders &&
              orders.length > 0 &&
              orders.map((order) => (
                <div className="mt-3 border bg-white p-6 shadow" key={order.id}>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-bold">{new Date(order.createdAt).toLocaleString()}</p>
                    <p className="text-primary">{order.status}</p>
                  </div>
                  <div>
                    {order.ordersItem.map((lineItem) => (
                      <div key={lineItem.id} className="rounded-sm border-t py-3 last:border-b">
                        <Link
                          to={`${PATH.PRODUCT_LIST}${generateNameId({
                            name: lineItem.product.name,
                            id: lineItem.product.id
                          })}`}
                          className="flex items-center justify-between"
                        >
                          <div className="flex-shrink-0">
                            <img
                              src={lineItem.product.thumbnail}
                              alt={lineItem.product.name}
                              className="h-20 w-20 border border-gray-300 object-cover"
                            />
                          </div>
                          <div className="ml-3 flex-grow overflow-hidden">
                            <div className="font-bold">{lineItem.product.name}</div>
                            <div className="mt-3">x{lineItem.quantity}</div>
                          </div>
                          <div className="ml-3 flex-shrink-0 truncate text-lg text-primary">
                            {formatCurrency(lineItem.unitPrice)}₫
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-end pt-6">
                    <span className="mr-1 text-xl">
                      <IconMoneybag />
                    </span>
                    <p>
                      <span className="text-sm">Order Total: </span>
                      <span className="text-xl font-medium text-primary">
                        {formatCurrency(
                          order.ordersItem.reduce(
                            (total, item) => total + item.quantity * item.unitPrice,
                            0
                          )
                        )}
                        ₫
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            {orders?.length === 0 && (
              <div className="mt-4 flex h-[600px] flex-col items-center justify-center gap-5">
                <img
                  className="h-[100px] w-[100px] object-cover"
                  src={IMAGES.NO_PURCHASE}
                  alt="no purchase"
                />
                <p>No orders yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default Order
