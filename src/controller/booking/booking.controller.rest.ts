import { type IBookingService } from '../../services/booking/booking.interface'
import { type NextFunction, type Request, type Response } from 'express'
import { HttpStatusCode } from 'axios'
import { type IBookingRestController } from './booking.interface'
import { OrderRepository } from '../../repository/order/order.repository'
import { DriverRepository } from '../../repository/driver/drive.repository'
import { type IProcessBookingOrderDTO } from '../../services/booking/booking.dto'
import { CustomerRepository } from '../../repository/customer/drive.repository'
import { BookingService } from '../../services/booking/booking.service'
import { RealtimeSvc } from '../../client/socket'

export default class BookingRestController implements IBookingRestController {
  private readonly bookingService: IBookingService
  private readonly orderRepo = new OrderRepository()
  private readonly driverRepo = new DriverRepository()
  private readonly customerRepo = new CustomerRepository()
  constructor () {
    this.bookingService = new BookingService(this.orderRepo, this.driverRepo, this.customerRepo)
    const realtimeSvc = new RealtimeSvc()
    this.bookingService.setRealtimeService(realtimeSvc)
  }

  processBookingOrder = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const data = await this.bookingService.processBookingOrderPub(req.body as unknown as IProcessBookingOrderDTO)
    res.status(HttpStatusCode.Ok).json({
      status: 'SUCCESS',
      data
    })
  }

  processBookingOrderSub = (): any => {
    this.bookingService.processBookingOrderSub().then(() => {}).catch(() => {})
  }
}

// TODO: refactor this
// const orderRepo = new OrderRepository()
// const driverRepo = new DriverRepository()
// const customerRepo = new CustomerRepository()
// const bookingService = new BookingService(orderRepo, driverRepo, customerRepo)
// bookingService.processBookingOrderSub().then(() => {}).catch(() => {})
