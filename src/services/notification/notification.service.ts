import { type IRealtimeSvc } from '../../client/socket/interface'
import { type INotificationService } from './notification.interface'

export default class NotificationService implements INotificationService {
  private realtimeSvc: IRealtimeSvc
  setRealtimeService = (realtimeSvc: IRealtimeSvc): any => {
    this.realtimeSvc = realtimeSvc
  }

  broadcast = (msgId: string, content: string): any => {
    this.realtimeSvc.broadcast(msgId, content)
  }
}
