import {
  IconCategory,
  IconClipboardText,
  IconKey,
  IconLayoutDashboard,
  IconLock,
  IconNews,
  IconPackage,
  IconTag,
  IconUsers,
  TablerIcon
} from '@tabler/icons-react'

import PATH from '@/utils/path'

export interface ISubmenu {
  href: string
  label: string
  active: boolean
}

interface IMenu {
  href: string
  label: string
  active: boolean
  icon: TablerIcon
  submenus: ISubmenu[]
}

interface IGroup {
  groupLabel: string
  menus: IMenu[]
}

export function getMenuList(pathname: string): IGroup[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: PATH.DASHBOARD,
          label: 'Dashboard',
          active: pathname === PATH.DASHBOARD,
          icon: IconLayoutDashboard,
          submenus: []
        },
        {
          href: PATH.DASHBOARD_USER,
          label: 'Users',
          active: pathname.includes(PATH.DASHBOARD_USER),
          icon: IconUsers,
          submenus: []
        },
        {
          href: PATH.DASHBOARD_ROLE,
          label: 'Roles',
          active: pathname.includes(PATH.DASHBOARD_ROLE),
          icon: IconKey,
          submenus: []
        },
        {
          href: PATH.DASHBOARD_PERMISSION,
          label: 'Permissions',
          active: pathname.includes(PATH.DASHBOARD_PERMISSION),
          icon: IconLock,
          submenus: []
        },
        {
          href: PATH.DASHBOARD_CATEGORY,
          label: 'Categories',
          active: pathname.includes(PATH.DASHBOARD_CATEGORY),
          icon: IconCategory,
          submenus: []
        },
        {
          href: '',
          label: 'Products',
          active: false,
          icon: IconPackage,
          submenus: [
            {
              href: PATH.DASHBOARD_PRODUCT,
              label: 'All Products',
              active: pathname === PATH.DASHBOARD_PRODUCT
            },
            {
              href: PATH.DASHBOARD_CREATE_PRODUCT,
              label: 'New Product',
              active: pathname === PATH.DASHBOARD_CREATE_PRODUCT
            }
          ]
        },
        {
          href: PATH.DASHBOARD_ORDER,
          label: 'Orders',
          active: pathname.includes(PATH.DASHBOARD_ORDER),
          icon: IconClipboardText,
          submenus: []
        },
        {
          href: '',
          label: 'Posts',
          active: false,
          icon: IconNews,
          submenus: [
            {
              href: PATH.DASHBOARD_POST,
              label: 'All Posts',
              active: pathname === PATH.DASHBOARD_POST
            },
            {
              href: PATH.DASHBOARD_CREATE_POST,
              label: 'New Post',
              active: pathname === PATH.DASHBOARD_CREATE_POST
            }
          ]
        },
        {
          href: PATH.DASHBOARD_TAG,
          label: 'Tags',
          active: pathname.includes(PATH.DASHBOARD_TAG),
          icon: IconTag,
          submenus: []
        }
      ]
    }
  ]
}
