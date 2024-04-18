import type http from 'http'
import { Server } from 'socket.io'
import { type DefaultEventsMap } from 'socket.io/dist/typed-events'
import { type IRealtimeSvc } from './interface'
import { createSocketServer } from '../../server'

export class RealtimeSvc implements IRealtimeSvc {
  private socketio: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  private readonly server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>

  constructor () {
    this.socketio = new Server(createSocketServer(), {
      path: '/realtime/booking-notify',
      cors: {
        origin: '*'
      }
    })
  }

  connect = (): any => {
    this.socketio = new Server(this.server, {
      cors: {
        origin: '*'
      }
    })
  }

  onConnection = (): any => {
    if (!this.socketio) {
      this.connect()
    }
    this.socketio.on('connection', (socket) => {
      console.log('socket-----', socket)
      console.log('a user connected')
    })
  }

  broadcast = (evt: string, msg: string): any => {
    if (!this.socketio) {
      this.connect()
    }
    this.socketio.emit(evt, msg)
  }

  listen = (evt: string, callback: (msg: string) => any): any => {
    if (!this.socketio) {
      this.connect()
    }
    this.socketio.emit(evt, callback)
  }
}
