import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { createServer } from 'http'
import { StatusCodes } from 'http-status-codes'
import { Server } from 'socket.io'
import corsOptions from './config/cors'
import env from './config/environment'
import { errorHandler } from './middlewares/error.middleware'
import routes from './routes'
import initSocket from './socket'
import { ClientToServerEvents, ServerToClientEvents } from './types/socket'
import { ApiError } from './utils/ApiError'
import { initFolder } from './utils/file'

const app = express()
const httpServer = createServer(app)

// init folder uploads
initFolder()

app.get('/', (req, res) => res.json({ message: 'Server is running' }))

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())

// init routes
app.use(routes)

// send 404 error for any unknown api request
app.use((req, res, next) => {
  next(
    new ApiError({
      status: StatusCodes.NOT_FOUND,
      message: 'Not Found API Request'
    })
  )
})

// middleware handle errors
app.use(errorHandler)

// handle socket
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: env.CLIENT_URL }
})

initSocket(io)

export default httpServer
