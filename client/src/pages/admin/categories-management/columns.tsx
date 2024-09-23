import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableRowActions } from '@/components/data-table/data-table-row-actions'
import { Checkbox } from '@/components/ui/checkbox'
import { ICategory } from '@/types/category'

const categoryColumns: ColumnDef<ICategory>[] = [
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
    accessorKey: 'thumbnail',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Thumbnail" />,
    cell: ({ row }) => (
      <img
        className="size-[80px] object-cover"
        src={row.original.thumbnail}
        alt={row.original.name}
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    enableSorting: true
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

export default categoryColumns
