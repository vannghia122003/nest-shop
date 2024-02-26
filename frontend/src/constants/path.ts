const path = {
  home: '/',
  login: '/login',
  register: '/register',
  logout: '/logout',
  productList: '/products',
  productDetail: '/products/:nameId',
  cart: '/cart',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/password',
  order: '/user/order',
  notification: '/user/notification',
  verifyEmail: '/verify-email',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  admin: '/admin',
  userAdmin: '/admin/users',
  productAdmin: '/admin/products',
  categoryAdmin: '/admin/categories',
  notificationAdmin: '/admin/notification',
  orderAdmin: '/admin/order',
  role: '/admin/roles'
} as const

export default path
