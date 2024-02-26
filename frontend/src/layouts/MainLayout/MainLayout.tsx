import { Outlet } from 'react-router-dom'
import Footer from '~/components/Footer'
import Header from '~/components/Header'

interface Props {
  children?: React.ReactNode
}

function MainLayout({ children }: Props) {
  return (
    <>
      <Header />
      {children}
      <Outlet />
      <Footer />
    </>
  )
}

export default MainLayout
