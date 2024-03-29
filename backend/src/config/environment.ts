import 'dotenv/config'

const env = {
  MONGODB_URI: process.env.MONGODB_URI as string,
  PORT: process.env.PORT as string,
  DB_USERNAME: process.env.DB_USERNAME as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_NAME: process.env.DB_NAME as string,
  BUILD_MODE: process.env.BUILD_MODE as string,

  SECRET_KEY_ACCESS_TOKEN: process.env.SECRET_KEY_ACCESS_TOKEN as string,
  SECRET_KEY_REFRESH_TOKEN: process.env.SECRET_KEY_REFRESH_TOKEN as string,
  SECRET_KEY_EMAIL_VERIFY_TOKEN: process.env.SECRET_KEY_EMAIL_VERIFY_TOKEN as string,
  SECRET_KEY_RESET_PASSWORD_TOKEN: process.env.SECRET_KEY_RESET_PASSWORD_TOKEN as string,

  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  EMAIL_VERIFY_TOKEN_EXPIRES_IN: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as string,
  RESET_PASSWORD_TOKEN_EXPIRES_IN: process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN as string,

  EMAIL_USER: process.env.EMAIL_USER as string,
  EMAIL_PASS: process.env.EMAIL_PASS as string,

  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,
  AWS_REGION: process.env.AWS_REGION as string,

  CLIENT_URL: process.env.CLIENT_URL as string
}

export default env
