import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableRowActions } from '@/components/data-table/data-table-row-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { IPost } from '@/types/post'

const postColumns: ColumnDef<IPost>[] = [
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
        alt={row.original.title}
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => <div className="max-w-[350px]">{row.original.title}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'tags',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tags" />,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-2">
        {row.original.tags.map((tag) => (
          <Badge key={tag.id} variant="outline" className="whitespace-nowrap border-primary/50">
            {tag.name}
          </Badge>
        ))}
      </div>
    )
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
    id: 'createdBy',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created by" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage
            src={row.original.createdBy.avatar ?? ''}
            alt={row.original.createdBy.name}
          />
          <AvatarFallback>{row.original.createdBy.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <span>{row.original.createdBy.name}</span>
      </div>
    ),
    enableSorting: false
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
]

export default postColumns
