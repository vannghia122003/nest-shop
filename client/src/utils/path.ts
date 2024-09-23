const PATH = {
  /* auth */
  LOGIN: '/login',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_ACCOUNT: '/verify-account',

  /* user */
  HOME: '/',
  PRIVACY_POLICY: '/privacy-policy',
  ACCOUNT: '/account',
  PROFILE: '/account/profile',
  CHANGE_PASSWORD: '/account/change-password',
  ORDER: '/account/order',
  CART: '/cart',
  PRODUCT_LIST: '/products',
  PRODUCT_DETAIL: '/products/:nameId',
  BLOG_LIST: '/blogs',
  BLOG_DETAIL: '/blogs/:id',

  /* dashboard */
  DASHBOARD: '/dashboard',
  DASHBOARD_USER: '/dashboard/user',
  DASHBOARD_ROLE: '/dashboard/role',
  DASHBOARD_PERMISSION: '/dashboard/permission',
  DASHBOARD_CATEGORY: '/dashboard/category',
  DASHBOARD_PRODUCT: '/dashboard/product',
  DASHBOARD_CREATE_PRODUCT: '/dashboard/product/new',
  DASHBOARD_UPDATE_PRODUCT: '/dashboard/product/:productId/update',
  DASHBOARD_ORDER: '/dashboard/order',
  DASHBOARD_POST: '/dashboard/post',
  DASHBOARD_CREATE_POST: '/dashboard/post/new',
  DASHBOARD_UPDATE_POST: '/dashboard/post/:postId/update',
  DASHBOARD_TAG: '/dashboard/tag'
} as const

export default PATH
