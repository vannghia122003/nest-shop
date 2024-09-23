import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react'
import { Row } from '@tanstack/react-table'

import { useTableContext } from '@/components/data-table/table-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface DataTableRowActionsProps<TData> {
  row: Row<TData & { id: number }>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const { setUpdatingRowId, setDeletingRowId } = useTableContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">Open menu</span>
          <IconDots className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setUpdatingRowId(row.original.id)}>
          <IconEdit className="mr-2 size-4" /> Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDeletingRowId(row.original.id)}>
          <IconTrash className="mr-2 size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
