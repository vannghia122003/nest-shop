import { IconBuildingStore, IconMenu2 } from '@tabler/icons-react'
import { Helmet } from 'react-helmet-async'
import { Link, Outlet } from 'react-router-dom'

import { TableProvider } from '@/components/data-table/table-provider'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet'
import UserNav from '@/components/user-nav'
import useLocalStorage from '@/hooks/use-local-storage'
import Menu from '@/layouts/admin-layout/menu'
import SidebarToggle from '@/layouts/admin-layout/sidebar-toggle'
import { cn } from '@/utils/helper'
import PATH from '@/utils/path'

function AdminLayout() {
  const [isOpen, setIsOpen] = useLocalStorage({ key: 'sidebar-open', defaultValue: true })

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="Dashboard" />
      </Helmet>

      <aside
        className={cn(
          'fixed left-0 top-0 z-20 h-screen -translate-x-full bg-background transition-[width] duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'w-72' : 'w-[90px]'
        )}
      >
        <SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800">
          <Button
            asChild
            variant="link"
            className={cn(
              'mb-1 transition-transform duration-300 ease-in-out',
              isOpen ? 'translate-x-0' : 'translate-x-1'
            )}
          >
            <Link to={PATH.DASHBOARD} className="flex items-center gap-2">
              <IconBuildingStore size={32} />
              <h1
                className={cn(
                  'whitespace-nowrap text-2xl font-bold transition-[transform,opacity,display] duration-300 ease-in-out',
                  isOpen ? 'translate-x-0 opacity-100' : 'hidden -translate-x-96 opacity-0'
                )}
              >
                Nest
              </h1>
            </Link>
          </Button>

          <Menu isOpen={isOpen} />
        </div>
      </aside>

      <main
        className={cn(
          'min-h-[100vh] bg-secondary transition-[margin-left] duration-300 ease-in-out',
          isOpen ? 'lg:ml-72' : 'lg:ml-[90px]'
        )}
      >
        <header className="sticky top-0 z-10 w-full bg-background shadow dark:shadow-secondary">
          <div className="mx-4 flex h-14 items-center gap-2 sm:mx-8">
            <div className="flex items-center space-x-4 lg:space-x-0">
              <Sheet>
                <SheetTrigger className="lg:hidden" asChild>
                  <Button className="h-8" variant="outline" size="icon">
                    <IconMenu2 size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent className="flex h-full flex-col px-3 sm:w-72" side="left">
                  <SheetHeader>
                    <Button
                      className="flex items-center justify-center pb-2 pt-1"
                      variant="link"
                      asChild
                    >
                      <Link to={PATH.DASHBOARD} className="flex items-center gap-2">
                        <IconBuildingStore size={32} />
                        <h1 className="text-2xl font-bold">Nest</h1>
                      </Link>
                    </Button>
                  </SheetHeader>
                  <Menu isOpen />
                </SheetContent>
              </Sheet>
            </div>

            <div className="w-[400px] max-w-full">
              <Input placeholder="Search..." className="w-full" />
            </div>

            <div className="flex flex-1 items-center justify-end gap-2">
              <ModeToggle />
              <UserNav />
            </div>
          </div>
        </header>

        <div className="container px-4 pb-8 pt-8 sm:px-8">
          <TableProvider>
            <Outlet />
          </TableProvider>
        </div>
      </main>
    </>
  )
}

export default AdminLayout
