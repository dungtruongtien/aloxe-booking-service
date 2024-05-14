import { type Request, type Response, type NextFunction } from 'express'
import { type INotificationRestController } from './notification.interface'
import { HttpStatusCode } from 'axios'
import { RealtimeSvc } from '../../client/socket'

export default class NotificationRestController implements INotificationRestController {
  private readonly realtimeSvc: RealtimeSvc

  constructor () {
    this.realtimeSvc = new RealtimeSvc()
  }

  broadcast = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const msgId = req.body.msgId
    const content = req.body.content
    await this.realtimeSvc.broadcast(msgId as string, content as string)
    res.status(HttpStatusCode.Ok).json({
      status: 'SUCCESS'
    })
  }
}
