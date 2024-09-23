import { Navigate, Outlet } from 'react-router-dom'

import { useAppContext } from '@/contexts/app-provider'
import PATH from '@/utils/path'

function AdminRoute() {
  const { profile } = useAppContext()

  return profile?.role.name !== 'CUSTOMER' ? <Outlet /> : <Navigate to={PATH.HOME} replace />
}
export default AdminRoute
