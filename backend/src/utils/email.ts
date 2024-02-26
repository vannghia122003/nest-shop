import nodemailer from 'nodemailer'
import env from '~/config/environment'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  service: 'Gmail',
  port: 587, // Sử dụng cổng 587
  secure: false, // Bật cơ chế TLS
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS
  }
})

const sendEmail = async ({
  to,
  subject,
  htmlContent
}: {
  to: string
  subject: string
  htmlContent: string
}) => {
  const mailOptions = {
    from: 'Nest Shop', // Người gửi
    to, // Người nhận
    subject: subject,
    html: htmlContent
  }

  const result = await transporter.sendMail(mailOptions)
  return result
}

export default sendEmail
