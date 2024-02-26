import { Server } from 'socket.io'
import reviewSocket from './review.socket'
import notificationSocket from './notification.socket'
import { ClientToServerEvents, ServerToClientEvents } from '~/types/socket'
import verifyEmailSocket from './verifyEmail.socket'

const initSocket = (io: Server<ClientToServerEvents, ServerToClientEvents>) => {
  io.on('connection', (socket) => {
    reviewSocket(socket)
    notificationSocket(socket)
    verifyEmailSocket(socket)
  })
}

export default initSocket
