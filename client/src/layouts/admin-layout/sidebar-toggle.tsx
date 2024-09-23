import { IconChevronLeft } from '@tabler/icons-react'
import { Dispatch } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/helper'

interface IProps {
  isOpen: boolean
  setIsOpen: Dispatch<React.SetStateAction<boolean>>
}

function SidebarToggle({ isOpen, setIsOpen }: IProps) {
  return (
    <div className="invisible absolute -right-[16px] top-[12px] z-20 lg:visible">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="size-8 rounded-md"
        variant="outline"
        size="icon"
      >
        <IconChevronLeft
          className={cn(
            'size-4 transition-transform duration-700 ease-in-out',
            isOpen ? 'rotate-0' : 'rotate-180'
          )}
        />
      </Button>
    </div>
  )
}

export default SidebarToggle
