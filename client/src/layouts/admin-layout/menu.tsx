import { IconDots } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import CollapseMenuButton from '@/layouts/admin-layout/collapse-menu-button'
import { cn } from '@/utils/helper'
import { getMenuList } from '@/utils/menu-list'

interface IProps {
  isOpen: boolean
}

function Menu({ isOpen }: IProps) {
  const location = useLocation()
  const menuList = getMenuList(location.pathname)

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-8 size-full">
        <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn('w-full', groupLabel && 'pt-5')} key={index}>
              {isOpen && groupLabel && (
                <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">
                  {groupLabel}
                </p>
              )}
              {!isOpen && groupLabel && (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="flex w-full items-center justify-center">
                        <IconDots className="size-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {menus.map(({ href, label, icon: Icon, active, submenus }, index) =>
                submenus.length === 0 ? (
                  <div className="w-full" key={index}>
                    <TooltipProvider disableHoverableContent>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={active ? 'secondary' : 'ghost'}
                            className="mb-1 h-10 w-full justify-start"
                            asChild
                          >
                            <Link to={href}>
                              <span className={cn(isOpen && 'mr-4')}>
                                <Icon size={18} />
                              </span>
                              <p
                                className={cn(
                                  'max-w-[200px] truncate',
                                  !isOpen
                                    ? '-translate-x-96 opacity-0'
                                    : 'translate-x-0 opacity-100'
                                )}
                              >
                                {label}
                              </p>
                            </Link>
                          </Button>
                        </TooltipTrigger>
                        {!isOpen && <TooltipContent side="right">{label}</TooltipContent>}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <div className="w-full" key={index}>
                    <CollapseMenuButton
                      icon={Icon}
                      label={label}
                      active={active}
                      submenus={submenus}
                      isOpen={isOpen}
                    />
                  </div>
                )
              )}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  )
}

export default Menu
