import type { CorsOptions } from 'cors'
import { StatusCodes } from 'http-status-codes'
import env from './environment'

class CorsError extends Error {
  message: string
  status: number
  constructor(message: string) {
    super(message)
    this.status = StatusCodes.FORBIDDEN
    this.message = message
  }
}

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (env.BUILD_MODE === 'dev') return callback(null, true)

    if (origin === env.CLIENT_URL) return callback(null, true)

    return callback(new CorsError(`${origin} not allowed by our CORS Policy.`))
  },

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  // CORS sẽ cho phép nhận cookies từ request
  credentials: true
}

export default corsOptions
