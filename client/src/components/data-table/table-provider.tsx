import { createContext, useContext, useState } from 'react'

interface TableProviderState {
  updatingRowId: number | null
  setUpdatingRowId: (rowId: number | null) => void
  deletingRowId: number | null
  setDeletingRowId: (rowId: number | null) => void
}

const initialState: TableProviderState = {
  updatingRowId: null,
  setUpdatingRowId: () => null,
  deletingRowId: null,
  setDeletingRowId: () => null
}

const TableProviderContext = createContext<TableProviderState>(initialState)

export function TableProvider({ children }: { children: React.ReactNode }) {
  const [updatingRowId, setUpdatingRowId] = useState<number | null>(null)
  const [deletingRowId, setDeletingRowId] = useState<number | null>(null)

  return (
    <TableProviderContext.Provider
      value={{ updatingRowId, setDeletingRowId, deletingRowId, setUpdatingRowId }}
    >
      {children}
    </TableProviderContext.Provider>
  )
}

export const useTableContext = () => {
  return useContext(TableProviderContext)
}
