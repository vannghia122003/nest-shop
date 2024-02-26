import { Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '~/App'
import Loading from '~/components/Loading'
import path from '~/constants/path'
import AuthLayout from '~/layouts/AuthLayout'
import MainLayout from '~/layouts/MainLayout'
import Admin from '~/pages/Admin'
import UserProfile from '~/pages/UserProfile'
import ProtectedRoute from './ProtectedRoute'
import RejectedRoute from './RejectedRoute'
import {
  Cart,
  CategoryAdmin,
  ChangePassword,
  Dashboard,
  ForgotPassword,
  Home,
  Login,
  NotFound,
  Notification,
  Order,
  OrderAdmin,
  ProductAdmin,
  ProductDetail,
  ProductList,
  Profile,
  Register,
  ResetPassword,
  VerifyEmail,
  NotificationAdmin,
  RoleManager,
  UserAdmin
} from './routes'

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
      {
        path: '/',
        element: <ProtectedRoute />,
        children: [
          {
            path: '',
            element: <MainLayout />,
            children: [
              {
                path: path.cart,
                element: (
                  <Suspense fallback={<Loading />}>
                    <Cart />
                  </Suspense>
                )
              },
              {
                path: path.user,
                element: <UserProfile />,
                children: [
                  {
                    path: path.profile,
                    element: (
                      <Suspense fallback={<Loading />}>
                        <Profile />
                      </Suspense>
                    )
                  },
                  {
                    path: path.changePassword,
                    element: (
                      <Suspense fallback={<Loading />}>
                        <ChangePassword />
                      </Suspense>
                    )
                  },
                  {
                    path: path.order,
                    element: (
                      <Suspense fallback={<Loading />}>
                        <Order />
                      </Suspense>
                    )
                  },
                  {
                    path: path.notification,
                    element: (
                      <Suspense fallback={<Loading />}>
                        <Notification />
                      </Suspense>
                    )
                  }
                ]
              }
            ]
          },
          {
            path: path.admin,
            element: <Admin />,
            children: [
              {
                path: path.admin,
                element: (
                  <Suspense fallback={<Loading />}>
                    <Dashboard />
                  </Suspense>
                )
              },
              {
                path: path.productAdmin,
                element: (
                  <Suspense fallback={<Loading />}>
                    <ProductAdmin />
                  </Suspense>
                )
              },
              {
                path: path.categoryAdmin,
                element: (
                  <Suspense fallback={<Loading />}>
                    <CategoryAdmin />
                  </Suspense>
                )
              },
              {
                path: path.orderAdmin,
                element: (
                  <Suspense fallback={<Loading />}>
                    <OrderAdmin />
                  </Suspense>
                )
              },
              {
                path: path.notificationAdmin,
                element: (
                  <Suspense fallback={<Loading />}>
                    <NotificationAdmin />
                  </Suspense>
                )
              },
              {
                path: path.userAdmin,
                element: (
                  <Suspense fallback={<Loading />}>
                    <UserAdmin />
                  </Suspense>
                )
              },
              {
                path: path.role,
                element: (
                  <Suspense fallback={<Loading />}>
                    <RoleManager />
                  </Suspense>
                )
              }
            ]
          }
        ]
      },
      {
        path: '/',
        element: <RejectedRoute />,
        children: [
          {
            path: '/',
            element: <AuthLayout />,
            children: [
              {
                path: path.login,
                element: (
                  <Suspense fallback={<Loading />}>
                    <Login />
                  </Suspense>
                )
              },
              {
                path: path.register,
                element: (
                  <Suspense fallback={<Loading />}>
                    <Register />
                  </Suspense>
                )
              },
              {
                path: path.forgotPassword,
                element: (
                  <Suspense fallback={<Loading />}>
                    <ForgotPassword />
                  </Suspense>
                )
              },
              {
                path: path.resetPassword,
                element: (
                  <Suspense fallback={<Loading />}>
                    <ResetPassword />
                  </Suspense>
                )
              }
            ]
          }
        ]
      },
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<Loading />}>
                <Home />
              </Suspense>
            )
          },
          {
            path: path.productList,
            element: (
              <Suspense fallback={<Loading />}>
                <ProductList />
              </Suspense>
            )
          },
          {
            path: path.productDetail,
            element: (
              <Suspense fallback={<Loading />}>
                <ProductDetail />
              </Suspense>
            )
          }
        ]
      },
      {
        path: path.verifyEmail,
        element: (
          <Suspense fallback={<Loading />}>
            <VerifyEmail />
          </Suspense>
        )
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
