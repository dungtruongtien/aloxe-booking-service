import Queue from 'bull'
import { type IBookingService } from './interface'
import { getDistanceFromLatLonInKm } from '../utils/distance'
import { type IUpdateOrderInput, type IOrderRepo, OrderStatus } from '../repository/order/order.interface'
import {
  DriverOnlineSessionWorkingStatusEnum,
  type IDriverRepo,
  type IUpdateDriverLoginSession
} from '../repository/driver/drive.interface'
import { type IProcessBookingOrderDTO } from './booking.dto'
import { type IDriver } from '../repository/driver/drive.schema'

const BOOKING_QUEUE_NAME = 'aloxe_booking'
const bookingQueue = new Queue(BOOKING_QUEUE_NAME)

interface IAssignDriverForBookingRes {
  driver: any
  minDistance: number
  totalPrice: number
  status: string
}

export class BookingService implements IBookingService {
  private readonly orderRepo: IOrderRepo
  private readonly driverRepo: IDriverRepo
  constructor (orderRepo: IOrderRepo, driverRepo: IDriverRepo) {
    this.orderRepo = orderRepo
    this.driverRepo = driverRepo
  }

  async processBookingOrderPub (input: IProcessBookingOrderDTO): Promise<any> {
    await bookingQueue.add(input)
    return null
  }

  async processBookingOrderSub (): Promise<any> {
    await bookingQueue.process(async (job: any, done) => {
      // Job is object of full order
      try {
        const resp = await this.handleAssignDriverForBooking(job.data as IProcessBookingOrderDTO)
        console.log('resp-------', resp)
        done()
      } catch (error) {
        done()
      }
    })
  }

  async handleAssignDriverForBooking (order: IProcessBookingOrderDTO): Promise<IAssignDriverForBookingRes | null> {
    const { driver, minDistance, totalPrice } = await this.getSuitableDriver(order)
    if (!driver) {
      // TODO Update order API
      // TODO Broadcast message to socket
      // await Booking.update(
      //   { status: 'DRIVER_NOT_FOUND' },
      //   { where: { id: booking.id } }
      // )
      const updateOrderDto: IUpdateOrderInput = {
        id: order.id,
        status: OrderStatus.DRIVER_NOT_FOUND
      }
      await this.orderRepo.updateOrder(updateOrderDto)
      return null
      // throw new NotfoundError('Cannot found driver')
    }

    // TODO Update order API
    // const updateBookingResp = await Booking.update(
    //   {
    //     driverId: driver.id,
    //     status: 'DRIVER_FOUND',
    //     amount: pricing
    //   },
    //   {
    //     where: { id: booking.id }
    //   }
    // )
    const updateOrderDto: IUpdateOrderInput = {
      id: order.id,
      driverId: driver.id,
      status: OrderStatus.DRIVER_FOUND,
      totalPrice
    }
    try {
      const updateOrderResp = await this.orderRepo.updateOrder(updateOrderDto)
      console.log('updateOrderResp-----', updateOrderResp)
    } catch (error) {
      console.log('error-----', error)
    }

    // TODO Update driver login session API
    // const updateDriverResp = await DriverLoginSession.update(
    //   { drivingStatus: 'DRIVING' },
    //   {
    //     where: {
    //       driverId: driver.id,
    //       status: 'ONLINE'
    //     }
    //   }
    // )
    const updateDriverLoginSessionDto: IUpdateDriverLoginSession = {
      driverId: driver.id,
      workingStatus: DriverOnlineSessionWorkingStatusEnum.DRIVING
    }
    await this.driverRepo.updateDriverOnlineSession(updateDriverLoginSessionDto)

    // TODO broadcast message
    // if (!updateBookingResp || !updateDriverResp) {
    //   throw new Error('Can not assign driver')
    // }

    return {
      driver,
      minDistance,
      totalPrice,
      status: 'DRIVER_FOUND'
    }
  }

  async getSuitableDriver (order: IProcessBookingOrderDTO): Promise<any> {
    // TODO Find ALL driver with filter API
    // const availableDrivers = await Driver.findAll({
    //   where: {
    //     vehicleType: booking.bookingDetail.vehicleType
    //   },
    //   include: [
    //     {
    //       model: DriverLogginSession,
    //       as: 'driverLoginSession',
    //       where: {
    //         status: 'ONLINE',
    //         drivingStatus: 'WAITING_FOR_CUSTOMER'
    //       }
    //     },
    //     {
    //       model: Vehicle,
    //       as: 'vehicle'
    //     }
    //   ]
    // })
    const availableDrivers = await this.driverRepo.getAvailableDrivers(order.orderDetail.vehicleType)
    if (!availableDrivers || availableDrivers.length === 0) {
      return { driver: null }
    }

    const { driver, minDistance, totalPrice } = await this.getNearestDriver(order, availableDrivers)
    if (!driver) {
      return null
    }

    return {
      driver,
      minDistance,
      totalPrice
    }
  }

  async getNearestDriver (order: IProcessBookingOrderDTO, availableDrivers: IDriver[]): Promise<any> {
    let suitableDriverIdx = -1
    let minDistance = Number.MAX_SAFE_INTEGER

    availableDrivers.forEach((driver: IDriver, idx: number) => {
      const { orderDetail } = order
      const { onlineSession } = driver
      if (!onlineSession) {
        return null
      }

      const userPosition = {
        lat: orderDetail.pickupLatitude,
        long: orderDetail.pickupLongitude
      }

      const driverPosition = {
        lat: parseFloat(onlineSession.currentLatitude),
        long: parseFloat(onlineSession.currentLongitude)
      }

      // Calculate distance from driver and user
      const distanceFromUserToDriver = getDistanceFromLatLonInKm(userPosition, driverPosition)
      console.log('distanceFromUserToDriver----', distanceFromUserToDriver)
      if (distanceFromUserToDriver < minDistance) {
        minDistance = distanceFromUserToDriver
        suitableDriverIdx = idx
      }
    })

    if (minDistance === Number.MAX_SAFE_INTEGER) {
      throw new Error('invalid lat long')
    }

    if (suitableDriverIdx === -1) {
      return { driver: null }
    }

    const { orderDetail } = order
    const startPosition = {
      lat: orderDetail.pickupLatitude,
      long: orderDetail.pickupLongitude
    }
    const endPosition = {
      lat: orderDetail.returnLatitude,
      long: orderDetail.returnLongitude
    }
    const startToEndDistance = getDistanceFromLatLonInKm(startPosition, endPosition)
    const totalPrice = startToEndDistance * 10000 // 10000 each km

    return {
      driver: availableDrivers[suitableDriverIdx],
      minDistance,
      totalPrice
    }
  }
}
