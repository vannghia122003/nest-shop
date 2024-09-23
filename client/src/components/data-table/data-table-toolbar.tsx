import { IconAdjustmentsHorizontal } from '@tabler/icons-react'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

interface IProps<TData> {
  table: Table<TData>
  searchColumn: keyof TData
}

function DataTableToolbar<TData>({ table, searchColumn }: IProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-x-2">
        <Input
          placeholder="Search..."
          className="h-8 w-[350px] pr-6 lg:w-[450px]"
          value={(table.getColumn(String(searchColumn))?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn(String(searchColumn))?.setFilterValue(event.target.value)
          }
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
            <IconAdjustmentsHorizontal className="mr-2 size-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default DataTableToolbar
