import { type NextFunction, type Response, type Request } from 'express'

export interface INotificationRestController {
  broadcast: (req: Request, res: Response, next: NextFunction) => Promise<any>
}
