import { type Order } from './order.schema'

export enum OrderStatus {
  DRIVER_CONFIRMED = 1,
  CANCELLED = 2,
  ARRIVED = 3,
  PAID = 4,
  ONBOARDING = 5,
  BOOKED = 6,
  DRIVER_NOT_FOUND = 7,
  DRIVER_FOUND = 7,
}

export interface IUpdateOrderInput {
  id: number
  status?: number
  driverId?: number
  totalPrice?: number
}

export interface IOrderRepo {
  updateOrder: (input: IUpdateOrderInput) => Promise<Order>
}
