import express, { type NextFunction, type Request, type Response } from 'express'
import apiRouteHandler from './routes/api.route'

interface ICustomError {
  message: string
  status?: number
  name: string
}

// eslint-disable-next-line
async function start () {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  // app.use(restAuthenticate)

  app.use('/api', apiRouteHandler)

  app.use((err: ICustomError, req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line
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

  app.listen({ port: 4005 }, function () {
    console.log('🚀 Server ready at http://localhost:4005/')
  })
}

start().catch((err) => {
  console.log('err', err)
})
