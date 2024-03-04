import { useQuery } from '@tanstack/react-query'
import {
  Button,
  Flowbite,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow
} from 'flowbite-react'
import orderApi from '~/apis/order.api'
import QUERY_KEYS from '~/constants/keys'
import { customTheme } from '~/types/custom.type'
import { OrderStatus } from '~/types/order.type'
import { convertISOString, formatCurrency } from '~/utils/helpers'

interface Props {
  openModal: boolean
  onCloseModal: () => void
  orderId: string
}

function OrderModal({ openModal, onCloseModal, orderId }: Props) {
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.ORDER_DETAIL, orderId],
    queryFn: () => orderApi.getOrderDetail(orderId),
    enabled: Boolean(orderId)
  })
  const order = data?.result

  const renderStatus = (status: OrderStatus) => {
    if (status === 0) return 'Chờ xác nhận'
    if (status === 1) return 'Đang giao'
    if (status === 2) return 'Đã giao'
    if (status === 3) return 'Đã huỷ'
  }

  return (
    <Modal
      dismissible
      show={openModal}
      onClose={onCloseModal}
      size="3xl"
      className="z-999 text-secondary"
    >
      <Modal.Header>Chi tiết hoá đơn</Modal.Header>
      <Modal.Body>
        {order && (
          <div className="flex flex-col gap-4">
            <div className="flex md:flex-row flex-col gap-3 md:gap-10">
              <div className="flex flex-col gap-3">
                <div>
                  <span className="font-bold mr-2">Mã:</span>
                  {order._id}
                </div>
                <div>
                  <span className="font-bold mr-2">Thời gian:</span>
                  {convertISOString(order.order_date)}
                </div>
                <div>
                  <span className="font-bold mr-2">Trạng thái:</span>
                  {renderStatus(order.status)}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <span className="font-bold mr-2">Khách hàng:</span>
                  {order.user.name}
                </div>
                <div>
                  <span className="font-bold mr-2">Số điện thoại:</span>
                  {order.user.phone}
                </div>
                <div>
                  <span className="font-bold mr-2">Địa chỉ:</span>
                  {order.user.address}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-3xl">
                <Flowbite theme={{ theme: customTheme }}>
                  <Table hoverable className="border border-gray-300">
                    <TableHead>
                      <TableHeadCell>Tên sản phẩm</TableHeadCell>
                      <TableHeadCell>Giá</TableHeadCell>
                      <TableHeadCell>Số lượng</TableHeadCell>
                      <TableHeadCell>Số tiền</TableHeadCell>
                    </TableHead>
                    <TableBody className="divide-y">
                      {order.products.map((product) => (
                        <TableRow className="bg-white" key={product.product_id}>
                          <TableCell>{product.product_detail.name}</TableCell>
                          <TableCell>{formatCurrency(product.product_detail.price)}₫</TableCell>
                          <TableCell>{product.buy_count}</TableCell>
                          <TableCell>
                            {formatCurrency(product.product_detail.price * product.buy_count)}₫
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Flowbite>
              </div>
            </div>
            <div className="flex justify-end">
              <div>
                <span className="font-bold mr-2">Tổng thanh toán:</span>{' '}
                {formatCurrency(order.total_price)}₫
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onCloseModal}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
export default OrderModal
