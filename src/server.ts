import express, { type NextFunction, type Request, type Response } from 'express'
import http from 'http'
import type e from 'express'
import { createRootRoute } from './routes/api.route'

let HTTP_SERVER: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
let SOCKET_SERVER: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>

interface ICustomError {
  message: string
  status?: number
  name: string
}

export const createApp = (): e.Express => {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  // app.use(restAuthenticate)
  app.use((err: ICustomError, req: Request, res: Response, next: NextFunction) => {
    if (!err.status || (err.status >= 500 && err.status <= 599)) {
      err.status = 500
      err.name = 'INTERNAL_ERROR'
      err.message = 'Internal error'
    }
    res.status(err.status).json({
      name: err.name,
      message: err.message,
      data: null,
      status: err.name
    })
  })
  return app
}

export function createHttpServer (): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> {
  if (!HTTP_SERVER) {
    const rootRouter = createRootRoute()
    const app = createApp()
    app.use('/api', rootRouter)
    HTTP_SERVER = http.createServer(app)
  }
  return HTTP_SERVER
}

export function createSocketServer (): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> {
  if (!SOCKET_SERVER) {
    const app = createApp()
    SOCKET_SERVER = http.createServer(app)
  }
  return SOCKET_SERVER
}
