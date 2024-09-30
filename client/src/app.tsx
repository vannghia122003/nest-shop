import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'

import accountApi from '@/api/account-api'
import { useAppContext } from '@/contexts/app-provider'
import { eventTarget, setItemLocalStorage } from '@/utils/helper'
import QUERY_KEY from '@/utils/query-key'

function App() {
  const { isAuthenticated, setProfile, logout } = useAppContext()
  useQuery({
    queryKey: [QUERY_KEY.PROFILE],
    queryFn: async () => {
      const res = await accountApi.getMe()
      setProfile(res.data)
      setItemLocalStorage('profile', JSON.stringify(res.data))
      return res
    },
    staleTime: 5 * 60 * 1000,
    enabled: isAuthenticated
  })

  useEffect(() => {
    eventTarget.addEventListener('logoutLocalStorage', logout)
    return () => {
      eventTarget.removeEventListener('logoutLocalStorage', logout)
    }
  }, [logout])

  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}

export default App
