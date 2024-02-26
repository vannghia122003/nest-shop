import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import notificationApi from '~/apis/notification.api'
import Images from '~/constants/images'
import { convertISOString } from '~/utils/helpers'

function Notification() {
  const queryClient = useQueryClient()
  const { data: notificationData } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationApi.getNotifications,
    staleTime: 5 * 60 * 1000
  })
  const markAllReadMutation = useMutation({
    mutationFn: notificationApi.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })
  const isReadAll = notificationData?.result.every((notification) => notification.read)

  const handleMarkAllRead = () => {
    if (!isReadAll) {
      markAllReadMutation.mutate()
    }
  }

  return (
    <div className="bg-white shadow rounded-sm">
      {notificationData && notificationData.result.length > 0 && (
        <div className="flex justify-center xs:justify-end">
          <button className="text-base hover:text-primary p-4" onClick={handleMarkAllRead}>
            Đánh dấu đã đọc tất cả
          </button>
        </div>
      )}
      <ul>
        {notificationData &&
          notificationData.result.length > 0 &&
          notificationData.result.map((notification) => (
            <li
              className={clsx(
                'p-4 flex hover:bg-gray-100 gap-5 items-center border-t border-gray-200',
                { 'bg-primary/20': !notification.read }
              )}
              key={notification._id}
            >
              <img
                className="w-[80px] h-[80px]"
                src={notification.image}
                alt={notification.title}
              />
              <div>
                <h4 className="uppercase mb-3 text-secondary">{notification.title}</h4>
                <p className="text-sm mb-2">{notification.content}</p>
                <p className="text-sm">{convertISOString(notification.created_at)}</p>
              </div>
            </li>
          ))}
        {notificationData && notificationData.result.length <= 0 && (
          <div className="py-20">
            <img
              className="mx-auto w-[200px] object-cover"
              src={Images.NO_NOTIFICATION}
              alt="empty notification"
            />
            <p className="mt-1 text-center">Chưa có thông báo mới</p>
          </div>
        )}
      </ul>
    </div>
  )
}

export default Notification
