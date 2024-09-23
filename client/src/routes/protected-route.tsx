import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAppContext } from '@/contexts/app-provider'
import PATH from '@/utils/path'

function ProtectedRoute() {
  const location = useLocation()
  const { isAuthenticated } = useAppContext()

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={`${PATH.LOGIN}?redirectUrl=${location.pathname}`} replace />
  )
}

export default ProtectedRoute
