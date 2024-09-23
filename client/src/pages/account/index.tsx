import { IconClipboardText, IconKey, IconUser } from '@tabler/icons-react'
import { Helmet } from 'react-helmet-async'
import { NavLink, Outlet } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAppContext } from '@/contexts/app-provider'
import { cn } from '@/utils/helper'
import PATH from '@/utils/path'

function Account() {
  const { profile } = useAppContext()

  if (!profile) return null

  return (
    <div className="p-5">
      <Helmet>
        <title>My profile | Nest Shop</title>
        <meta name="description" content="My profile" />
      </Helmet>
      <div className="container">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-3 lg:col-span-2">
            <div className="flex flex-col [&>a]:justify-start">
              <NavLink
                to={PATH.PROFILE}
                className={({ isActive }) => cn(isActive ? 'text-primary' : 'text-foreground')}
              >
                <Button
                  variant="link"
                  leftSection={<IconUser />}
                  className="text-inherit transition-colors hover:text-primary"
                >
                  Profile
                </Button>
              </NavLink>
              <NavLink
                to={PATH.CHANGE_PASSWORD}
                className={({ isActive }) => cn(isActive ? 'text-primary' : 'text-foreground')}
              >
                <Button
                  variant="link"
                  leftSection={<IconKey />}
                  className="text-inherit transition-colors hover:text-primary"
                >
                  Change Password
                </Button>
              </NavLink>
              <NavLink
                to={PATH.ORDER}
                className={({ isActive }) => cn(isActive ? 'text-primary' : 'text-foreground')}
              >
                <Button
                  variant="link"
                  leftSection={<IconClipboardText />}
                  className="text-inherit transition-colors hover:text-primary"
                >
                  My Order
                </Button>
              </NavLink>
            </div>
          </div>
          <div className="md:col-span-9 lg:col-span-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Account
