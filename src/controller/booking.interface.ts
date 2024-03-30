import { type NextFunction, type Response, type Request } from 'express'

export interface IBookingRestController {
  processBookingOrder: (req: Request, res: Response, next: NextFunction) => Promise<any>
}
