import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { useContext, useEffect, useRef } from 'react'
import { FaTimes } from 'react-icons/fa'
import {
  HiOutlineBell,
  HiOutlineClipboardDocumentList,
  HiOutlineSquare3Stack3D,
  HiOutlineSquares2X2,
  HiOutlineUserGroup
} from 'react-icons/hi2'
import { LiaUserCogSolid } from 'react-icons/lia'
import { MdOutlineAdminPanelSettings, MdOutlineCategory } from 'react-icons/md'
import { TbLogout } from 'react-icons/tb'
import { Link, NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'
import authApi from '~/apis/auth.api'
import path from '~/constants/path'
import { AppContext } from '~/contexts/app.context'
import { clearLocalStorage, getRefreshTokenFromLocalStorage } from '~/utils/auth'

interface Props {
  sidebarOpen: boolean
  setSidebarOpen: (arg: boolean) => void
}

const menu = [
  { name: 'Dashboard', icon: <HiOutlineSquares2X2 />, path: path.admin },
  { name: 'Sản phẩm', icon: <HiOutlineSquare3Stack3D />, path: path.productAdmin },
  { name: 'Danh mục', icon: <MdOutlineCategory />, path: path.categoryAdmin },
  { name: 'Đơn hàng', icon: <HiOutlineClipboardDocumentList />, path: path.orderAdmin },
  { name: 'Thông báo', icon: <HiOutlineBell />, path: path.notificationAdmin },
  { name: 'Người dùng', icon: <HiOutlineUserGroup />, path: path.userAdmin },
  { name: 'Vai trò', icon: <LiaUserCogSolid />, path: path.role }
]

function Sidebar({ sidebarOpen, setSidebarOpen }: Props) {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const trigger = useRef<HTMLButtonElement>(null)
  const sidebar = useRef<HTMLElement>(null)
  const logoutMutation = useMutation({ mutationFn: authApi.logout })

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return
      setSidebarOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  })

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== 'Escape') return
      setSidebarOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  })

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
    <aside
      ref={sidebar}
      className={clsx(
        'absolute left-0 top-0 z-99 flex h-screen flex-col overflow-y-hidden bg-[#1C2434] duration-300 ease-linear lg:static lg:translate-x-0',
        {
          'translate-x-0': sidebarOpen,
          '-translate-x-full': !sidebarOpen
        }
      )}
    >
      <div className="px-6 py-5 lg:py-6">
        <div className="flex items-center justify-center gap-2 relative">
          <Link to={path.admin} className="text-5xl text-white">
            <MdOutlineAdminPanelSettings />
          </Link>
        </div>
      </div>
      <button
        ref={trigger}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="block lg:hidden text-white absolute top-0 right-0 p-2"
      >
        <FaTimes />
      </button>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="py-4 px-4 lg:px-6">
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {menu.map((item) => (
                <li key={item.path}>
                  <NavLink
                    end
                    to={item.path}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-2.5 rounded-sm py-2 px-8 text-white duration-300 ease-in-out hover:bg-[#333A48]',
                        { 'bg-[#333A48]': isActive }
                      )
                    }
                  >
                    <span className="text-2xl">{item.icon}</span>
                    {item.name}
                  </NavLink>
                </li>
              ))}
              <li>
                <button
                  className="flex items-center gap-2.5 rounded-sm py-2 px-8 text-white duration-300 ease-in-out hover:bg-[#333A48]"
                  onClick={handleLogout}
                >
                  <span className="text-2xl">
                    <TbLogout />
                  </span>
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
