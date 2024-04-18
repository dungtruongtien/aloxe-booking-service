import { type Request, type Response, type NextFunction } from 'express'
import { type INotificationRestController } from './notification.interface'
import { type INotificationService } from '../../services/notification/notification.interface'
import { HttpStatusCode } from 'axios'

export default class NotificationRestController implements INotificationRestController {
  private readonly notificationService: INotificationService

  constructor (notificationService: INotificationService) {
    this.notificationService = notificationService
  }

  broadcast = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const msgId = req.body.msgId
    const content = req.body.content
    this.notificationService.broadcast(msgId as string, content as string)
    res.status(HttpStatusCode.Ok).json({
      status: 'SUCCESS'
    })
  }
}
