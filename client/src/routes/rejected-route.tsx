import { Navigate, Outlet, useSearchParams } from 'react-router-dom'

import { useAppContext } from '@/contexts/app-provider'

function RejectedRoute() {
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAppContext()
  const redirectUrl = searchParams.get('redirectUrl')

  return isAuthenticated ? <Navigate to={redirectUrl ? redirectUrl : '/'} /> : <Outlet />
}

export default RejectedRoute
