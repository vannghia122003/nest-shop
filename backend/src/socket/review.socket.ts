import { Socket } from 'socket.io'
import { ClientToServerEvents, ServerToClientEvents } from '~/types/socket'

const reviewSocket = (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  socket.on('join_product_room', (product_id) => {
    socket.join(product_id)
    socket.on('add_review', () => {
      socket.broadcast.to(product_id).emit('add_review')
    })
    socket.on('update_review', () => {
      socket.broadcast.to(product_id).emit('update_review')
    })
    socket.on('delete_review', () => {
      socket.broadcast.to(product_id).emit('delete_review')
    })
    socket.on('typing_review', () => {
      socket.broadcast.to(product_id).emit('typing_review')
    })
    socket.on('review_empty', () => {
      socket.broadcast.to(product_id).emit('review_empty')
    })
    socket.on('disconnect', () => {
      socket.leave(product_id)
    })
  })
}

export default reviewSocket
