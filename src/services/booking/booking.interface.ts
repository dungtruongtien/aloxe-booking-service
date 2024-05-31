import { type IRealtimeSvc } from '../../client/socket/interface'
import { type IProcessBookingOrderDTO } from './booking.dto'

export interface IBookingService {
  processBookingOrderPub: (order: IProcessBookingOrderDTO) => Promise<any>
  processBookingOrderSub: () => Promise<any>
  jobInfoLogging: () => Promise<any>
  setRealtimeService: (realtimeSvc: IRealtimeSvc) => any
}
