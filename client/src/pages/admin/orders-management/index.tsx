import { useMutation, useQuery } from '@tanstack/react-query'

import { orderApi } from '@/api'
import DataTable from '@/components/data-table'
import { useTableContext } from '@/components/data-table/table-provider'
import FormDialog from '@/components/form-dialog'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import orderColumns from '@/pages/admin/orders-management/columns'
import { OrderStatus } from '@/types/order'
import { formatCurrency } from '@/utils/helper'
import QUERY_KEY from '@/utils/query-key'

function OrdersManagement() {
  const { updatingRowId, deletingRowId, setUpdatingRowId } = useTableContext()
  const deleteOrderMutation = useMutation({ mutationFn: orderApi.deleteOrder })
  const updateOrderMutation = useMutation({ mutationFn: orderApi.updateOrder })
  const ordersQuery = useQuery({
    queryKey: [QUERY_KEY.ORDERS],
    queryFn: () => orderApi.getAllOrders({ limit: '-1' }),
    staleTime: 5 * 60 * 1000
  })
  const orderDetailQuery = useQuery({
    queryKey: [QUERY_KEY.ORDER_DETAIL, updatingRowId],
    queryFn: () => orderApi.getOrderById(updatingRowId!),
    enabled: Boolean(updatingRowId)
  })
  const orderDetail = orderDetailQuery.data?.data

  const handleOpenChangeDialog = (open: boolean) => {
    !open && setUpdatingRowId(null)
  }

  const handleDeleteRow = async () => {
    if (deletingRowId) {
      await deleteOrderMutation.mutateAsync(deletingRowId)
      await ordersQuery.refetch()
    }
  }

  const handleChangeStatus = async (value: OrderStatus) => {
    if (updatingRowId) {
      await updateOrderMutation.mutateAsync({ orderId: updatingRowId, body: { status: value } })
      orderDetailQuery.refetch()
      ordersQuery.refetch()
    }
  }

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Orders ({ordersQuery.data?.data.meta.totalItems})
          </h2>
          <p className="mb-4 text-muted-foreground">Manage orders</p>
        </div>
        <FormDialog
          title={`Order ${orderDetail?.id}`}
          description=""
          open={Boolean(updatingRowId)}
          onOpenChange={handleOpenChangeDialog}
        >
          {orderDetail && (
            <>
              <h6 className="text-lg font-medium">Details</h6>
              <div className="mt-4 rounded-sm border text-sm">
                <div className="flex items-center px-6 py-3">
                  <p className="min-w-[100px]">Customer</p>
                  <p className="font-medium">{orderDetail.user.name}</p>
                </div>
                <Separator />
                <div className="flex items-center px-6 py-3">
                  <p className="min-w-[100px]">Address</p>
                  <p className="font-medium">
                    {`${orderDetail.address}, ${orderDetail.ward}, ${orderDetail.district}, ${orderDetail.province}`}
                  </p>
                </div>
                <Separator />
                <div className="flex items-center px-6 py-3">
                  <p className="min-w-[100px]">Date</p>
                  <p className="font-medium">
                    {orderDetail && new Date(orderDetail.createdAt).toLocaleString()}
                  </p>
                </div>
                <Separator />
                <div className="flex items-center px-6 py-3">
                  <p className="min-w-[100px]">Status</p>
                  <Select
                    value={orderDetail.status}
                    onValueChange={handleChangeStatus}
                    disabled={updateOrderMutation.isPending}
                  >
                    <SelectTrigger className="w-[150px] border-2">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={OrderStatus.PROCESSING}>
                        {OrderStatus.PROCESSING}
                      </SelectItem>
                      <SelectItem value={OrderStatus.SHIPPING}>{OrderStatus.SHIPPING}</SelectItem>
                      <SelectItem value={OrderStatus.COMPLETED}>{OrderStatus.COMPLETED}</SelectItem>
                      <SelectItem value={OrderStatus.CANCELLED}>{OrderStatus.CANCELLED}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <h6 className="mt-6 text-lg font-medium">Line items</h6>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetail.ordersItem.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="flex items-center pr-4 font-medium">
                        <img
                          src={item.product.thumbnail}
                          className="size-10 object-cover"
                          alt={item.product.name}
                        />
                        <p className="ml-2 line-clamp-2">{item.product.name}</p>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}₫</TableCell>
                      <TableCell>{formatCurrency(item.quantity * item.unitPrice)}₫</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell>
                      {formatCurrency(
                        orderDetail.ordersItem.reduce(
                          (total, item) => total + item.quantity * item.unitPrice,
                          0
                        )
                      )}
                      ₫
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          )}
        </FormDialog>
      </div>
      <Card className="p-6">
        <DataTable
          columns={orderColumns}
          data={ordersQuery?.data?.data.data || []}
          onDeleteRow={handleDeleteRow}
          searchColumn="status"
        />
      </Card>
    </>
  )
}
export default OrdersManagement
