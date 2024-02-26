import { Socket } from 'socket.io'
import { ClientToServerEvents, ServerToClientEvents } from '~/types/socket'

const notificationSocket = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  socket.on('send_notification', () => {
    socket.broadcast.emit('receive_notifications')
  })
}

export default notificationSocket
