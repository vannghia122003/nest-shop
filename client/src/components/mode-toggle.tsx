import { IconMoon, IconSun } from '@tabler/icons-react'

import { useTheme } from '@/contexts/theme-provider'
import { Button } from '@/components/ui/button'

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      className="size-8 rounded-full bg-background"
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <IconSun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform duration-500 ease-in-out dark:rotate-0 dark:scale-100" />
      <IconMoon className="scale-1000 absolute h-[1.2rem] w-[1.2rem] rotate-0 transition-transform duration-500 ease-in-out dark:-rotate-90 dark:scale-0" />
      <span className="sr-only">Switch Theme</span>
    </Button>
  )
}
