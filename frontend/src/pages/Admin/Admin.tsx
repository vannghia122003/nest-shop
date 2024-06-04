import { useContext, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate, Outlet } from 'react-router-dom'
import { AppContext } from '~/contexts/app.context'
import { Roles } from '~/types/role.type'
import Header from './components/Header'
import Sidebar from './components/Sidebar'

function Admin() {
  const { profile } = useContext(AppContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (profile?.role.name === Roles.Customer) return <Navigate to="/" />

  return (
    <div className="flex h-screen overflow-hidden">
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
      </Helmet>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="bg-[#F1F5F9]">
          <div className="mx-auto max-w-screen-2xl p-6 min-h-[calc(100vh-94px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
export default Admin
