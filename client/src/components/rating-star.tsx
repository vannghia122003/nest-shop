import { IconStar, IconStarFilled } from '@tabler/icons-react'

import { cn } from '@/utils/helper'

interface Props {
  rating: number
  size?: number
  activeClassName?: string
  noneActiveClassName?: string
  className?: string
}

function RatingStar({
  size,
  rating,
  className,
  activeClassName = 'text-yellow-400',
  noneActiveClassName = 'text-gray-300'
}: Props) {
  const handleWidth = (order: number) => {
    if (order <= rating) return '100%'
    if (order > rating && order - rating < 1) return `${(rating - Math.floor(rating)) * 100}%`
    return '0%'
  }

  return (
    <div className={cn('inline-flex items-center', className)}>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div className="relative" key={index}>
            <div
              className="absolute left-0 top-0 h-full overflow-hidden"
              style={{ width: handleWidth(index + 1) }}
            >
              <IconStarFilled size={size} className={activeClassName} />
            </div>
            <IconStar size={size} className={noneActiveClassName} />
          </div>
        ))}
    </div>
  )
}

export default RatingStar
