import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'

import { useAppContext } from '@/contexts/app-provider'
import { eventTarget } from '@/utils/helper'

function App() {
  const { logout } = useAppContext()

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
