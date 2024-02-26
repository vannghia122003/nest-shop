import { Router } from 'express'
import authController from '~/controllers/auth.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import catchAsync from '~/utils/catchAsync'

const authRoute = Router()

authRoute.post('/register', authMiddleware.register, catchAsync(authController.register))
authRoute.post('/login', authMiddleware.login, catchAsync(authController.login))
authRoute.post(
  '/logout',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyRefreshToken,
  catchAsync(authController.logout)
)

/*
  body: {refresh_token: string}
*/
authRoute.post(
  '/refresh-token',
  authMiddleware.verifyRefreshToken,
  catchAsync(authController.refreshToken)
)

/*
  Header: { Authorization: Bearer token }
  body: {}
*/
authRoute.post(
  '/send-verify-email',
  authMiddleware.verifyAccessToken,
  catchAsync(authController.sendVerifyEmail)
)

/* body: { token: string } */
authRoute.post(
  '/verify-email',
  authMiddleware.verifyEmailToken,
  catchAsync(authController.verifyEmail)
)

/*
  body: { email: string }
*/
authRoute.post(
  '/forgot-password',
  authMiddleware.forgotPassword,
  catchAsync(authController.forgotPassword)
)

/*
  body: { forgot_password_token: string, password: string, confirm_password: string }
*/
authRoute.post(
  '/reset-password',
  authMiddleware.resetPassword,
  catchAsync(authController.resetPassword)
)

export default authRoute
