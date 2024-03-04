import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import {
  Button as ButtonFlowBite,
  Flowbite,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow
} from 'flowbite-react'
import { useState } from 'react'
import { FaEye, FaSync, FaTimes, FaTrashAlt } from 'react-icons/fa'
import { SingleValue } from 'react-select'
import orderApi from '~/apis/order.api'
import ConfirmModal from '~/components/ConfirmModal'
import Select from '~/components/Select'
import { orderStatus } from '~/constants/order'
import { customTheme } from '~/types/custom.type'
import { OrderQuery, OrderStatus } from '~/types/order.type'
import { convertISOString, formatCurrency } from '~/utils/helpers'
import OrderModal from './OrderModal'
import QUERY_KEYS from '~/constants/keys'

const options = [
  { label: 'Chờ xác nhận', value: orderStatus.processing },
  { label: 'Đang giao', value: orderStatus.shipping },
  { label: 'Đã giao', value: orderStatus.completed },
  { label: 'Đã huỷ', value: orderStatus.cancelled }
]

function OrderAdmin() {
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [orderListQuery, setOrderListQuery] = useState<OrderQuery>({
    limit: 5,
    page: 1
  })
  const { data: ordersData, refetch } = useQuery({
    queryKey: [QUERY_KEYS.ORDERS, orderListQuery],
    queryFn: () => orderApi.getOrders(orderListQuery),
    placeholderData: keepPreviousData
  })
  const updateOrderMutation = useMutation({ mutationFn: orderApi.updateOrder })
  const deleteOrderMutation = useMutation({ mutationFn: orderApi.deleteOrder })

  const handlePageChange = (page: number) => setOrderListQuery({ ...orderListQuery, page })

  const handleChangeStatus =
    (order_id: string) => (option: SingleValue<{ label: string; value: number }>) => {
      if (option) {
        updateOrderMutation.mutate(
          { order_id, data: { status: option.value as OrderStatus } },
          {
            onSuccess: () => {
              refetch()
            }
          }
        )
      }
    }

  const handleCloseConfirmModal = () => {
    setOrderId('')
    setOpenConfirmModal(false)
  }

  const handleDeleteOrder = (orderId: string) => {
    setOpenConfirmModal(true)
    setOrderId(orderId)
  }

  const handleConfirmDeleteOrder = () => {
    deleteOrderMutation.mutate(orderId, {
      onSuccess: () => {
        setOpenConfirmModal(false)
        setOrderId('')
        refetch()
      }
    })
  }

  const handleViewOrderDetail = (orderId: string) => {
    setOpenModal(true)
    setOrderId(orderId)
  }

  return (
    <div className="p-20 bg-white overflow-x-auto shadow">
      <div className="min-w-[900px]">
        <div className="py-4 flex items-center justify-between">
          <h2 className="text-secondary text-3xl">Đơn hàng</h2>
          <div className="flex gap-2">
            {options.map((option) => (
              <button
                key={option.value}
                className={clsx(
                  'rounded-lg border border-[#ececec] bg-white p-2 shadow duration-300 hover:border-secondary sm:px-4 whitespace-nowrap',
                  { 'border-secondary': orderListQuery.status === option.value }
                )}
                onClick={() => setOrderListQuery({ ...orderListQuery, status: option.value })}
              >
                {option.label}
              </button>
            ))}
            <button
              onClick={() => setOrderListQuery({ ...orderListQuery, status: -1 })}
              title="Xoá bộ lọc"
              className="rounded-lg border border-[#ececec] bg-white px-3 py-2 shadow duration-300 hover:border-secondary "
            >
              <FaTimes />
            </button>
            <button
              onClick={() => refetch()}
              title="Làm mới"
              className="rounded-lg border border-[#ececec] bg-white px-3 py-2 shadow duration-300 hover:border-secondary "
            >
              <FaSync />
            </button>
          </div>
        </div>
        <Flowbite theme={{ theme: customTheme }}>
          <Table hoverable className="border border-gray-300">
            <TableHead>
              <TableHeadCell>Mã</TableHeadCell>
              <TableHeadCell>Thời gian</TableHeadCell>
              <TableHeadCell>Trạng thái</TableHeadCell>
              <TableHeadCell>Giá</TableHeadCell>
              <TableHeadCell>Thao tác</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {ordersData &&
                ordersData.result.map((order) => (
                  <TableRow className="bg-white" key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{convertISOString(order.order_date)}</TableCell>
                    <TableCell>
                      <div className="w-[200px]">
                        <Select
                          isSearchable={false}
                          value={{
                            value: order.status,
                            label: options.find((item) => item.value === order.status)?.label || ''
                          }}
                          options={options}
                          onChange={handleChangeStatus(order._id)}
                          isDisabled={updateOrderMutation.isPending}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(order.total_price)}₫</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <ButtonFlowBite
                          color="cyan"
                          size="xs"
                          title="Xem chi tiết"
                          onClick={() => handleViewOrderDetail(order._id)}
                        >
                          <span className="text-lg">
                            <FaEye />
                          </span>
                        </ButtonFlowBite>
                        <ButtonFlowBite
                          color="red"
                          size="xs"
                          title="Xoá"
                          onClick={() => handleDeleteOrder(order._id)}
                        >
                          <span className="text-lg">
                            <FaTrashAlt />
                          </span>
                        </ButtonFlowBite>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Flowbite>
        <div className="bg-white border-t p-4 flex justify-center">
          <Pagination
            layout="pagination"
            currentPage={orderListQuery.page as number}
            totalPages={ordersData?.total_pages || 0}
            onPageChange={handlePageChange}
            previousLabel=""
            nextLabel=""
            showIcons
          />
        </div>
      </div>
      <ConfirmModal
        description="Bạn có chắc chắn muốn xóa đơn hàng này không?"
        openModal={openConfirmModal}
        onCloseModal={handleCloseConfirmModal}
        onConfirm={handleConfirmDeleteOrder}
        isLoading={deleteOrderMutation.isPending}
      />
      <OrderModal
        openModal={openModal}
        onCloseModal={() => {
          setOpenModal(false)
          setOrderId('')
        }}
        orderId={orderId}
      />
    </div>
  )
}
export default OrderAdmin
