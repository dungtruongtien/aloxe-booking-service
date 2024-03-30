import { type IBookingService } from '../services/interface'
import { BookingService } from '../services/booking.service'
import { type NextFunction, type Request, type Response } from 'express'
import { HttpStatusCode } from 'axios'
import { type IBookingRestController } from './booking.interface'
import { OrderRepository } from '../repository/order/order.repository'
import { DriverRepository } from '../repository/driver/drive.repository'
import { type IProcessBookingOrderDTO } from '../services/booking.dto'

export default class BookingRestController implements IBookingRestController {
  private readonly bookingService: IBookingService
  private readonly orderRepo = new OrderRepository()
  private readonly driverRepo = new DriverRepository()
  constructor () {
    this.bookingService = new BookingService(this.orderRepo, this.driverRepo)
  }

  processBookingOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const data = await this.bookingService.processBookingOrderPub(req.body as unknown as IProcessBookingOrderDTO)
    res.status(HttpStatusCode.Ok).json({
      status: 'SUCCESS',
      data
    })
  }
}

const orderRepo = new OrderRepository()
const driverRepo = new DriverRepository()
const bookingService = new BookingService(orderRepo, driverRepo)
bookingService.processBookingOrderSub().then(() => {}).catch(() => {})
