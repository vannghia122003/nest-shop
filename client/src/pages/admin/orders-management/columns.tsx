import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableRowActions } from '@/components/data-table/data-table-row-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { IOrder, OrderStatus } from '@/types/order'
import { cn, formatCurrency } from '@/utils/helper'

const statusColors: Record<OrderStatus, string> = {
  PROCESSING: 'bg-amber-200 dark:bg-amber-500',
  SHIPPING: 'bg-cyan-200 dark:bg-cyan-500',
  COMPLETED: 'bg-green-200 dark:bg-green-500',
  CANCELLED: 'bg-red-200 dark:bg-red-400'
}

const orderColumns: ColumnDef<IOrder>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'Order',
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
    cell: ({ row }) => `#${row.original.id}`,
    enableSorting: true,
    enableHiding: false
  },
  {
    id: 'customer',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => (
      <div className="flex items-center">
        <Avatar>
          <AvatarImage src={row.original.user.avatar ?? ''} alt={row.original.user.name} />
          <AvatarFallback>{row.original.user.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="ml-2 flex flex-col">
          <span>{row.original.user.name}</span>
          <span className="text-muted-foreground">{row.original.user.email}</span>
        </div>
      </div>
    ),
    enableSorting: false
  },
  {
    id: 'Date',
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => format(new Date(row.original.createdAt), 'H:mm:ss dd/MM/yyyy'),
    enableSorting: true
  },
  {
    id: 'Items',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Items" />,
    cell: ({ row }) => row.original.ordersItem.reduce((total, item) => total + item.quantity, 0)
  },
  {
    id: 'Price',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => {
      const price = row.original.ordersItem.reduce(
        (total, item) => total + item.quantity * item.unitPrice,
        0
      )
      return (
        <>
          {formatCurrency(price)}
          <sup>₫</sup>
        </>
      )
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn('min-w-[75px] justify-center border-none', statusColors[row.original.status])}
      >
        {row.original.status}
      </Badge>
    ),
    enableSorting: false
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
]

export default orderColumns
