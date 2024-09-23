import { Outlet } from 'react-router-dom'

import Header from '@/components/header'
import Footer from '@/components/footer'

function MainLayout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>
        {children}
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
export default MainLayout
