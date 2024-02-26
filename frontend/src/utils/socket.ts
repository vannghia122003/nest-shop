import { Socket, io } from 'socket.io-client'
import config from '~/constants/config'
import { ClientToServerEvents, ServerToClientEvents } from '~/types/socket.type'

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(config.api_url, {
  autoConnect: false
})
