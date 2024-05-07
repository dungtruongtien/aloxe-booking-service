import { type IDriver } from '../../repository/driver/drive.schema'
import { type IProcessBookingOrderDTO } from '../booking/booking.dto'

export interface IDriverPickupStrategy {
  pickup: (order: IProcessBookingOrderDTO, drivers: IDriver[]) => Promise<IGetSuitableDriverResp>
}

export interface IGetSuitableDriverResp {
  driver: IDriver | null
  minDistance: number
  totalPrice: number
}
