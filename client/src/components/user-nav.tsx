import { IconClipboardText, IconLayoutDashboard, IconLogout, IconUser } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import authApi from '@/api/auth-api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useAppContext } from '@/contexts/app-provider'
import { getItemLocalStorage, logoutLocalStorage } from '@/utils/helper'
import PATH from '@/utils/path'

function UserNav() {
  const { profile, setProfile, setIsAuthenticated } = useAppContext()
  const logoutMutation = useMutation({ mutationFn: authApi.logout })

  const handleLogout = async () => {
    const refreshToken = getItemLocalStorage('refreshToken') || ''
    const res = await logoutMutation.mutateAsync({ refreshToken })
    setIsAuthenticated(false)
    setProfile(null)
    logoutLocalStorage()
    toast.success(res.message)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center">
          <Button variant="outline" className="relative size-8 rounded-full">
            <Avatar className="size-8">
              <AvatarImage src={profile?.avatar ?? undefined} alt={profile?.name} />
              <AvatarFallback className="bg-transparent">
                {profile?.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Button>
          <span className="ml-1 hidden text-sm font-medium lg:inline">{profile?.name}</span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-52" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            {profile?.role.name !== 'CUSTOMER' && (
              <Link to={PATH.DASHBOARD} className="flex items-center">
                <IconLayoutDashboard className="mr-3 size-4 text-muted-foreground" />
                Dashboard
              </Link>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link to={PATH.PROFILE} className="flex items-center">
              <IconUser className="mr-3 size-4 text-muted-foreground" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" asChild>
            <Link to={PATH.ORDER} className="flex items-center">
              <IconClipboardText className="mr-3 size-4 text-muted-foreground" />
              Order
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:cursor-pointer" onClick={handleLogout}>
          <IconLogout className="mr-3 size-4 text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserNav
