import { IconLogin, IconNews } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

import HeaderCart from '@/components/header/header-cart'
import HeaderSearch from '@/components/header/header-search'
import Logo from '@/components/logo'
import { Button } from '@/components/ui/button'
import UserNav from '@/components/user-nav'
import { useAppContext } from '@/contexts/app-provider'
import PATH from '@/utils/path'

function Header() {
  const { isAuthenticated } = useAppContext()

  return (
    <header className="border-b-2 py-3">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
          <Logo />
          <div className="order-1 max-w-[700px] grow sm:order-none sm:basis-[40%]">
            <HeaderSearch />
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to={PATH.BLOG_LIST} className="!p-2">
                <IconNews />
                <span className="ml-1 hidden lg:inline">News</span>
              </Link>
            </Button>

            <HeaderCart />
            {isAuthenticated && <UserNav />}
            {!isAuthenticated && (
              <Button variant="ghost" asChild>
                <Link to={PATH.LOGIN} className="!p-2">
                  <IconLogin />
                  <span className="ml-1 hidden lg:inline">Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
export default Header
