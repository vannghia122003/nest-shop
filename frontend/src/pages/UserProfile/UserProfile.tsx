import { Outlet } from 'react-router-dom'
import clsx from 'clsx'
import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import path from '~/constants/path'
import { AppContext } from '~/contexts/app.context'
import { Helmet } from 'react-helmet-async'

function UserProfile() {
  const { profile } = useContext(AppContext)

  return (
    <div className="pt-5 pb-14 bg-[#f5f5f5]">
      <Helmet>
        <title>Thông tin người dùng | Nest Shop</title>
        <meta name="description" content="Thông tin người dùng" />
      </Helmet>
      <div className="container">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="md:col-span-3 lg:col-span-2">
            <div className="flex items-center flex-col justify-center gap-2 border-b border-gray-200 py-4">
              <Link
                to={path.profile}
                className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black/10"
              >
                <img src={profile?.avatar} alt="avatar" className="h-full w-full object-cover" />
              </Link>
              <div className="flex-grow overflow-hidden pl-4">
                <div className="mb-1 truncate font-semibold text-secondary">{profile?.name}</div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-4 text-secondary">
              <NavLink
                to={path.profile}
                className={({ isActive }) =>
                  clsx('flex items-center gap-1 capitalize transition-colors hover:text-primary', {
                    'text-primary': isActive
                  })
                }
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
                <span>Hồ sơ</span>
              </NavLink>
              <NavLink
                to={path.changePassword}
                className={({ isActive }) =>
                  clsx('flex items-center gap-1 capitalize transition-colors hover:text-primary', {
                    'text-primary': isActive
                  })
                }
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
                    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                  />
                </svg>
                <span>Đổi mật khẩu</span>
              </NavLink>
              <NavLink
                to={path.order}
                className={({ isActive }) =>
                  clsx('flex items-center gap-1 capitalize transition-colors hover:text-primary', {
                    'text-primary': isActive
                  })
                }
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
                    d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
                  />
                </svg>
                <span>Đơn mua</span>
              </NavLink>
              <NavLink
                to={path.notification}
                className={({ isActive }) =>
                  clsx('flex items-center gap-1 capitalize transition-colors hover:text-primary', {
                    'text-primary': isActive
                  })
                }
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
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
                <span>Thông báo</span>
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

export default UserProfile
