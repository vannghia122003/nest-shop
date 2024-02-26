import Footer from '~/components/Footer'
import AuthHeader from '~/components/AuthHeader'
import { Outlet } from 'react-router-dom'
import Images from '~/constants/images'

interface Props {
  children?: React.ReactNode
}

function AuthLayout({ children }: Props) {
  return (
    <>
      <AuthHeader />
      <div className="bg-[#49a5af]">
        <div className="container">
          <div className="grid grid-cols-1 py-12 sm:px-4 lg:grid-cols-5">
            <div className="col-span-3 hidden lg:flex items-center">
              <img className="h-full w-full" src={Images.AUTH_BG} alt="background" />
            </div>
            <div className="self-center lg:col-span-2 lg:col-start-4">
              <Outlet />
              {children}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default AuthLayout
