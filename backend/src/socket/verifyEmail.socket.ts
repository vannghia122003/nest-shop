import { Socket } from 'socket.io'
import { ClientToServerEvents, ServerToClientEvents } from '~/types/socket'

const verifyEmailSocket = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  socket.on('join_user_room', (user_id: string) => {
    socket.join(user_id)

    socket.on('user_verify_email_success', () => {
      socket.to(user_id).emit('verify_email_success')
    })

    socket.on('disconnect', () => {
      socket.leave(user_id)
    })
  })
}

export default verifyEmailSocket
