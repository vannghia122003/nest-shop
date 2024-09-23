import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import App from '@/app'
import Loading from '@/components/loading'
import AdminLayout from '@/layouts/admin-layout'
import AuthLayout from '@/layouts/auth-layout'
import MainLayout from '@/layouts/main-layout'
import Account from '@/pages/account'
import CategoriesManagement from '@/pages/admin/categories-management'
import Dashboard from '@/pages/admin/dashboard'
import ForgotPassword from '@/pages/forgot-password'
import Login from '@/pages/login'
import ResetPassword from '@/pages/reset-password'
import SignUp from '@/pages/sign-up'
import AdminRoute from '@/routes/admin-route'
import ProtectedRoute from '@/routes/protected-route'
import RejectedRoute from '@/routes/rejected-route'
import PATH from '@/utils/path'

const Home = lazy(() => import('@/pages/home'))
const PrivacyPolicy = lazy(() => import('@/pages/privacy-policy'))
const BlogList = lazy(() => import('@/pages/blog-list'))
const BlogDetail = lazy(() => import('@/pages/blog-detail'))
const ProductList = lazy(() => import('@/pages/product-list'))
const ProductDetail = lazy(() => import('@/pages/product-detail'))
const Cart = lazy(() => import('@/pages/cart'))
const Profile = lazy(() => import('@/pages/account/profile'))
const ChangePassword = lazy(() => import('@/pages/account/change-password'))
const Order = lazy(() => import('@/pages/account/order'))
const VerifyAccount = lazy(() => import('@/pages/verify-account'))
const NotFound = lazy(() => import('@/pages/not-found'))

const UsersManagement = lazy(() => import('@/pages/admin/users-management'))
const RolesManagement = lazy(() => import('@/pages/admin/roles-management'))
const PermissionsManagement = lazy(() => import('@/pages/admin/permissions-management'))
const OrdersManagement = lazy(() => import('@/pages/admin/orders-management'))
const TagsManagement = lazy(() => import('@/pages/admin/tags-management'))
const ProductsManagement = lazy(() => import('@/pages/admin/products-management'))
const ProductForm = lazy(() => import('@/pages/admin/products-management/product-form'))
const PostsManagement = lazy(() => import('@/pages/admin/posts-management'))
const PostForm = lazy(() => import('@/pages/admin/posts-management/post-form'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: (
      <MainLayout>
        <NotFound />
      </MainLayout>
    ),
    children: [
      /* private route */
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminRoute />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  { path: PATH.DASHBOARD, element: <Dashboard /> },
                  {
                    path: PATH.DASHBOARD_USER,
                    element: <Suspense fallback={<Loading />} children={<UsersManagement />} />
                  },
                  {
                    path: PATH.DASHBOARD_ROLE,
                    element: <Suspense fallback={<Loading />} children={<RolesManagement />} />
                  },
                  {
                    path: PATH.DASHBOARD_PERMISSION,
                    element: (
                      <Suspense fallback={<Loading />} children={<PermissionsManagement />} />
                    )
                  },
                  {
                    path: PATH.DASHBOARD_CATEGORY,
                    element: <Suspense fallback={<Loading />} children={<CategoriesManagement />} />
                  },
                  {
                    path: PATH.DASHBOARD_PRODUCT,
                    element: <Suspense fallback={<Loading />} children={<ProductsManagement />} />
                  },
                  {
                    path: PATH.DASHBOARD_CREATE_PRODUCT,
                    element: <Suspense fallback={<Loading />} children={<ProductForm />} />
                  },
                  {
                    path: PATH.DASHBOARD_UPDATE_PRODUCT,
                    element: <Suspense fallback={<Loading />} children={<ProductForm />} />
                  },
                  {
                    path: PATH.DASHBOARD_ORDER,
                    element: <Suspense fallback={<Loading />} children={<OrdersManagement />} />
                  },
                  {
                    path: PATH.DASHBOARD_POST,
                    element: <Suspense fallback={<Loading />} children={<PostsManagement />} />
                  },
                  {
                    path: PATH.DASHBOARD_CREATE_POST,
                    element: <Suspense fallback={<Loading />} children={<PostForm />} />
                  },
                  {
                    path: PATH.DASHBOARD_UPDATE_POST,
                    element: <Suspense fallback={<Loading />} children={<PostForm />} />
                  },
                  {
                    path: PATH.DASHBOARD_TAG,
                    element: <Suspense fallback={<Loading />} children={<TagsManagement />} />
                  }
                ]
              }
            ]
          },
          {
            element: <MainLayout />,
            children: [
              {
                path: PATH.CART,
                element: <Suspense fallback={<Loading />} children={<Cart />} />
              },
              {
                path: PATH.ACCOUNT,
                element: <Account />,
                children: [
                  {
                    path: PATH.PROFILE,
                    element: <Suspense fallback={<Loading />} children={<Profile />} />,
                    index: true
                  },
                  {
                    path: PATH.CHANGE_PASSWORD,
                    element: <Suspense fallback={<Loading />} children={<ChangePassword />} />
                  },
                  {
                    path: PATH.ORDER,
                    element: <Suspense fallback={<Loading />} children={<Order />} />
                  }
                ]
              }
            ]
          }
        ]
      },

      /* rejected route */
      {
        element: <RejectedRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: PATH.LOGIN, element: <Login /> },
              { path: PATH.SIGN_UP, element: <SignUp /> },
              { path: PATH.FORGOT_PASSWORD, element: <ForgotPassword /> },
              { path: PATH.RESET_PASSWORD, element: <ResetPassword /> }
            ]
          }
        ]
      },

      /* public route */
      {
        element: <MainLayout />,
        children: [
          {
            path: PATH.HOME,
            element: <Suspense fallback={<Loading />} children={<Home />} />
          },
          {
            path: PATH.PRIVACY_POLICY,
            element: <Suspense fallback={<Loading />} children={<PrivacyPolicy />} />
          },
          {
            path: PATH.PRODUCT_LIST,
            element: <Suspense fallback={<Loading />} children={<ProductList />} />
          },
          {
            path: PATH.PRODUCT_DETAIL,
            element: <Suspense fallback={<Loading />} children={<ProductDetail />} />
          },
          {
            path: PATH.BLOG_LIST,
            element: <Suspense fallback={<Loading />} children={<BlogList />} />
          },
          {
            path: PATH.BLOG_DETAIL,
            element: <Suspense fallback={<Loading />} children={<BlogDetail />} />
          }
        ]
      },

      {
        path: PATH.VERIFY_ACCOUNT,
        element: <Suspense fallback={<Loading />} children={<VerifyAccount />} />
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<Loading />}>
            <NotFound />
          </Suspense>
        )
      }
    ]
  }
])

export default router
