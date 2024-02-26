import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { FaRegEye } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import notificationApi from '~/apis/notification.api'
import Popover from '~/components/Popover'
import Images from '~/constants/images'
import path from '~/constants/path'
import { Notification } from '~/types/notification.type'

interface Props {
  notificationList: Notification[]
}

function Notification({ notificationList }: Props) {
  const queryClient = useQueryClient()
  const markAllReadMutation = useMutation({
    mutationFn: notificationApi.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })
  const unreadCount = notificationList.filter((notification) => !notification.read).length
  const isReadAll = notificationList.every((notification) => notification.read)

  const handleMarkAllRead = () => {
    if (!isReadAll) {
      markAllReadMutation.mutate()
    }
  }

  return (
    <Popover
      placement="bottom"
      renderPopover={
        <div className="bg-white min-w-[350px] max-w-[400px] rounded-sm shadow-md">
          {notificationList.length > 0 ? (
            <div>
              <header className="flex justify-between items-center text-sm">
                <h3 className="px-3">Thông báo</h3>
                <button className="hover:text-primary p-3" onClick={handleMarkAllRead}>
                  Đánh dấu đã đọc tất cả
                </button>
              </header>
              <ul className="max-h-[50vh] overflow-y-auto">
                {notificationList.map((notification) => (
                  <li
                    className={clsx(
                      'p-3 flex hover:bg-gray-100 gap-3 items-center border-t border-gray-200',
                      { 'bg-primary/20': !notification.read }
                    )}
                    key={notification._id}
                  >
                    <img
                      className="w-[48px] h-[48px]"
                      src={notification.image}
                      alt={notification.title}
                    />
                    <div>
                      <h4 className="uppercase mb-1 text-sm text-secondary">
                        {notification.title}
                      </h4>
                      <p className="text-xs">{notification.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <footer className="border-t border-gray-200 hover:bg-gray-100 flex items-center justify-center">
                <Link
                  to={path.notification}
                  className="p-3 flex items-center gap-1 w-full justify-center"
                >
                  <FaRegEye />
                  Xem tất cả
                </Link>
              </footer>
            </div>
          ) : (
            <div className="py-16">
              <img
                className="mx-auto object-cover h-[100px]"
                src={Images.NO_NOTIFICATION}
                alt="empty notification"
              />
              <p className="mt-1 text-center">Chưa thông báo mới</p>
            </div>
          )}
        </div>
      }
    >
      <Link to={path.notification} className="flex items-center p-1 text-white hover:opacity-70">
        <div className="relative">
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
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-2 rounded-lg bg-white px-1 text-xs text-primary">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="ml-1 hidden whitespace-nowrap lg:block">Thông báo</span>
      </Link>
    </Popover>
  )
}
export default Notification
