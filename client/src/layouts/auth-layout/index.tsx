import { Outlet } from 'react-router-dom'

import Footer from '@/components/footer'
import AuthHeader from '@/layouts/auth-layout/auth-header'
import IMAGES from '@/utils/images'

function AuthLayout() {
  return (
    <>
      <AuthHeader />
      <div className="bg-[#49a5af]">
        <div className="container">
          <div className="flex items-center py-12">
            <div className="hidden md:block">
              <img className="h-full w-full" src={IMAGES.AUTH_BG} alt="background" />
            </div>
            <div className="flex grow justify-center">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
export default AuthLayout
