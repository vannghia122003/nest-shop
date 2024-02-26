import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect } from 'react'
import { FaRegUser } from 'react-icons/fa'
import { LuClipboardCheck } from 'react-icons/lu'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { TbLogout } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import authApi from '~/apis/auth.api'
import cartApi from '~/apis/cart.api'
import Images from '~/constants/images'
import path from '~/constants/path'
import { AppContext } from '~/contexts/app.context'
import { clearLocalStorage, getRefreshTokenFromLocalStorage } from '~/utils/auth'
import Popover from '../Popover'
import Cart from './Cart'
import Search from './Search'
import Notification from './Notification'
import notificationApi from '~/apis/notification.api'
import { socket } from '~/utils/socket'
import config from '~/constants/config'

function Header() {
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useContext(AppContext)

  const logoutMutation = useMutation({ mutationFn: authApi.logout })
  // khi chuyển trang thì header chỉ re-render chứ k bị unmount và mounting lại (trừ trường hợp logout rồi nhảy vào RegisterLayout rồi nhảy vào lại)
  // nên các query này sẽ ko bị inactive (inactive khi k có component nào subscribe) => ko bị gọi lại => ko cần set staleTime = Infinity
  const { data: cartData } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000
  })
  const { data: notificationData, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationApi.getNotifications,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000
  })

  useEffect(() => {
    if (isAuthenticated) {
      socket.on('receive_notifications', refetch)
    }
    return () => {
      socket.off('receive_notifications', refetch)
    }
  }, [isAuthenticated, refetch])

  const handleLogout = () => {
    const refresh_token = getRefreshTokenFromLocalStorage()
    logoutMutation.mutate(
      { refresh_token },
      {
        onSuccess: (data) => {
          setIsAuthenticated(false)
          setProfile(null)
          clearLocalStorage()
          toast.success(data.message)
        }
      }
    )
  }

  return (
    <div className="bg-primary/90 py-3">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap">
          <div className="basis-[150px] sm:basis-[180px] lg:basis-[200px]">
            <Link to="/">
              <img src={Images.LOGO_LIGHT} className="h-full w-full object-cover" alt="logo" />
            </Link>
          </div>
          <div className="order-1 grow sm:order-none sm:basis-[40%]">
            <Search />
          </div>
          <div>
            <div className="flex justify-between gap-4">
              <Cart productsInCart={cartData?.result || []} />
              <Notification notificationList={notificationData?.result || []} />

              {isAuthenticated && (
                <Popover
                  renderPopover={
                    <div className="min-w-[150px] rounded-md border border-gray-200 bg-white shadow-md">
                      <ul>
                        {profile?.role._id !== config.user_role_id && (
                          <li className="cursor-pointer hover:bg-gray-100 hover:text-primary">
                            <Link to={path.admin} className="flex items-end gap-1 px-4 py-3">
                              <span className="text-2xl">
                                <MdOutlineAdminPanelSettings />
                              </span>
                              <span>Trang quản trị</span>
                            </Link>
                          </li>
                        )}
                        <li className="cursor-pointer hover:bg-gray-100 hover:text-primary">
                          <Link to={path.profile} className="flex items-end gap-1 px-4 py-3">
                            <span className="text-2xl">
                              <FaRegUser />
                            </span>
                            <span>Tài khoản của tôi</span>
                          </Link>
                        </li>
                        <li className="cursor-pointer hover:bg-gray-100 hover:text-primary">
                          <Link to={path.order} className="flex items-end gap-1 px-4 py-3">
                            <span className="text-2xl">
                              <LuClipboardCheck />
                            </span>
                            <span>Đơn mua</span>
                          </Link>
                        </li>
                        <li
                          className="cursor-pointer px-4 py-3 hover:bg-gray-100 hover:text-primary"
                          onClick={handleLogout}
                          aria-hidden="true"
                        >
                          <div className="flex items-end gap-1">
                            <span className="text-2xl">
                              <TbLogout />
                            </span>
                            <span>Đăng xuất</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  }
                >
                  <div className="flex cursor-pointer items-center p-1 text-white hover:opacity-70">
                    <div className="mr-1 h-6 w-6 flex-shrink-0">
                      <img
                        className="h-full w-full rounded-full object-cover"
                        src={profile?.avatar || Images.USER}
                        alt="avatar"
                      />
                    </div>
                    <span className="hidden truncate whitespace-nowrap lg:block">
                      {profile?.name}
                    </span>
                  </div>
                </Popover>
              )}
              {!isAuthenticated && (
                <Link
                  to={path.login}
                  title="Tài khoản"
                  className="flex items-center p-1 text-white hover:opacity-70"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                  <span className="ml-1 hidden whitespace-nowrap lg:block">Đăng nhập</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
