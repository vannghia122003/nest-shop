import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useContext, useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from './contexts/app.context'
import { LocalStorageEventTarget } from './utils/auth'
import { socket } from './utils/socket'

function App() {
  const { reset } = useContext(AppContext)

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLocalStorage', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLocalStorage', reset)
    }
  }, [reset])

  /* handle socket */
  useEffect(() => {
    socket.connect()
    return () => {
      socket.disconnect()
    }
  }, [])
  /* end handle socket  */

  return (
    <div>
      <ToastContainer pauseOnFocusLoss={false} autoClose={5000} />
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      <ScrollRestoration />
      <Outlet />
    </div>
  )
}

export default App
