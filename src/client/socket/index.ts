import type http from 'http'
import { Server } from 'socket.io'
import { type DefaultEventsMap } from 'socket.io/dist/typed-events'
import { type IRealtimeSvc } from './interface'
import { createSocketServer } from '../../server'

let GLOBAL_SOCKET_IO: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

export class RealtimeSvc implements IRealtimeSvc {
  private socketio: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  private readonly server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>

  constructor () {
    if (!GLOBAL_SOCKET_IO) {
      GLOBAL_SOCKET_IO = new Server(createSocketServer(), {
        path: '/realtime/booking-notify',
        cors: {
          origin: '*'
        }
      })
      this.socketio = GLOBAL_SOCKET_IO
      this.socketio.engine.on('connection_error', (err) => {
        console.log(err.req) // the request object
        console.log(err.code) // the error code, for example 1
        console.log(err.message) // the error message, for example "Session ID unknown"
        console.log(err.context) // some additional error context
      })
      this.onConnection()
    }
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
