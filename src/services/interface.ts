import { type IProcessBookingOrderDTO } from './booking.dto'

export interface IBookingService {
  processBookingOrderPub: (order: IProcessBookingOrderDTO) => Promise<any>
  processBookingOrderSub: () => Promise<any>
}
