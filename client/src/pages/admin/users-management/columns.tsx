import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableRowActions } from '@/components/data-table/data-table-row-actions'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { IUser } from '@/types/user'
import { cn } from '@/utils/helper'

const columnsUser: ColumnDef<IUser>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    enableSorting: true,
    enableHiding: false
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    enableSorting: false
  },
  {
    id: 'Status',
    accessorKey: 'isActive',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          'min-w-[75px] justify-center border-none',
          row.original.isActive ? 'bg-green-200 dark:bg-green-500' : 'bg-red-200 dark:bg-red-400'
        )}
      >
        {row.original.isActive ? 'ACTIVE' : 'INACTIVE'}
      </Badge>
    ),
    enableSorting: false
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => format(new Date(row.original.updatedAt), 'H:mm:ss dd/MM/yyyy'),
    enableSorting: true
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => format(new Date(row.original.createdAt), 'H:mm:ss dd/MM/yyyy'),
    enableSorting: true
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
]

export default columnsUser
