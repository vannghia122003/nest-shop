import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableRowActions } from '@/components/data-table/data-table-row-actions'
import { Checkbox } from '@/components/ui/checkbox'
import { IPermission } from '@/types/permission'
import { cn } from '@/utils/helper'

export const methodColors = {
  GET: 'text-green-500',
  POST: 'text-yellow-500',
  PUT: 'text-blue-500',
  PATCH: 'text-purple-500',
  DELETE: 'text-red-500'
}

const permissionColumns: ColumnDef<IPermission>[] = [
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
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    enableSorting: true
  },
  {
    accessorKey: 'path',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Path" />,
    enableSorting: false
  },
  {
    accessorKey: 'method',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Method" />,
    cell: ({ row }) => (
      <span className={cn('font-semibold', methodColors[row.original.method])}>
        {row.original.method}
      </span>
    ),
    enableSorting: false
  },
  {
    accessorKey: 'module',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Module" />,
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

export default permissionColumns
