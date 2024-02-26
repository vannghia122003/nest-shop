import sendEmail from '~/utils/email'
import fs from 'fs'
import path from 'path'
import User from '~/models/User'
import env from '~/config/environment'

const emailTemplate = fs.readFileSync(
  path.resolve('src', 'public', 'templates', 'email.html'),
  'utf-8'
)

const emailService = {
  async sendVerificationEmail(user: User) {
    const subject = 'Xác thực email của bạn'
    const verificationEmailUrl = `${env.CLIENT_URL}/verify-email?token=${user.email_verify_token}`
    const htmlContent = emailTemplate
      .replace('{{title}}', `Xin chào ${user.name}`)
      .replace('{{content}}', 'Nhấn vào nút bên dưới để xác thực email của bạn')
      .replace('{{titleLink}}', 'Xác thực email')
      .replace('{{link}}', verificationEmailUrl)
    const result = await sendEmail({ to: user.email, subject, htmlContent })
    return result
  },

  async sendResetPasswordEmail(user: User) {
    const subject = 'Thiết lập lại mật khẩu đăng nhập'
    const resetPasswordUrl = `${env.CLIENT_URL}/forgot-password?token=${user.reset_password_token}`
    const htmlContent = emailTemplate
      .replace('{{title}}', `Xin chào ${user.name}`)
      .replace('{{content}}', 'Nhấn vào nút bên dưới để đặt lại mật khẩu của bạn')
      .replace('{{titleLink}}', 'Đặt lại mật khẩu')
      .replace('{{link}}', resetPasswordUrl)
    const result = await sendEmail({ to: user.email, subject, htmlContent })
    return result
  }
}

export default emailService
