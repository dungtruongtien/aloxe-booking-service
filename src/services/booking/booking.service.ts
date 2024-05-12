import Queue from 'bull'
import { type IBookingService } from './booking.interface'
import { toZonedTime } from 'date-fns-tz'
import { type IUpdateOrderInput, type IOrderRepo, OrderStatus } from '../../repository/order/order.interface'
import {
  DriverOnlineSessionWorkingStatusEnum,
  type IDriverRepo,
  type IUpdateDriverLoginSession
} from '../../repository/driver/drive.interface'
import { type IProcessBookingOrderDTO } from './booking.dto'
import { type ICustomerRepo } from '../../repository/customer/user.interface'
import { type IRealtimeSvc } from '../../client/socket/interface'
import { DriverPickingBasedLocationAndState, DriverPickingStrategy } from '../driver-pickup/driver_pickup.service'

const BOOKING_QUEUE_NAME = 'aloxe_booking'
const bookingQueue = new Queue(BOOKING_QUEUE_NAME)

interface IAssignDriverForBookingRes {
  driver: {
    id: number
  }
  minDistance: number
  totalPrice: number
  status: string
}

export class BookingService implements IBookingService {
  private readonly orderRepo: IOrderRepo
  private readonly driverRepo: IDriverRepo
  private readonly customerRepo: ICustomerRepo
  private realtimeSvc: IRealtimeSvc
  private readonly driverPickingStrategy = new DriverPickingStrategy(new DriverPickingBasedLocationAndState())
  constructor (orderRepo: IOrderRepo, driverRepo: IDriverRepo, customerRepo: ICustomerRepo) {
    this.orderRepo = orderRepo
    this.driverRepo = driverRepo
    this.customerRepo = customerRepo
  }

  setRealtimeService = (realtimeSvc: IRealtimeSvc): any => {
    this.realtimeSvc = realtimeSvc
  }

  async processBookingOrderPub (input: IProcessBookingOrderDTO): Promise<any> {
    let delayInMilliseconds = 0
    if (input.startTime) {
      const nowInVN = toZonedTime(new Date(), 'Asia/Ho_Chi_Minh')
      const startTimeInVN = toZonedTime(new Date(input.startTime), 'Asia/Ho_Chi_Minh')
      delayInMilliseconds = startTimeInVN.getTime() - nowInVN.getTime()
    }
    await bookingQueue.add(input, { delay: delayInMilliseconds })
    return null
  }

  async processBookingOrderSub (): Promise<any> {
    await bookingQueue.process(async (job: any, done) => {
      // Job is object of full order
      try {
        const input: IProcessBookingOrderDTO = job.data
        const resp = await this.handleAssignDriverForBooking(input)
        console.log('resp-------', resp)
        if (input.supportStaffId) {
          this.realtimeSvc.broadcast(input.supportStaffId.toString(), 'Hello')
        }
        if (resp?.driver) {
          const customer = await this.customerRepo.getCustomer(input.customerId)
          if (customer) {
            this.realtimeSvc.broadcast(input.id.toString(), 'Hello')
            this.realtimeSvc.broadcast(resp.driver.id.toString(), JSON.stringify({
              message: 'Bạn có 1 đơn đặt xe',
              booking: { ...input, status: 'DRIVER_FOUND', minDistance: resp.minDistance },
              customer: {
                fullName: customer.user.fullName,
                phoneNumber: customer.user.phoneNumber
                // avatar: customer.user.avatar
              }
            }))
          }
        }
        done()
      } catch (error) {
        console.log('error------', error)
        done()
      }
    })
  }

  handleAssignDriverForBooking = async (order: IProcessBookingOrderDTO): Promise<IAssignDriverForBookingRes | null> => {
    const availableDrivers = await this.driverRepo.getAvailableDrivers(order.orderDetail.vehicleType)
    if (!availableDrivers || availableDrivers.length === 0) {
      return null
    }
    const { driver, minDistance, totalPrice } = await this.driverPickingStrategy.pickup(order, availableDrivers)
    if (!driver) {
      console.log('driver-----', driver)
      // await this.realtimeSvc.broadcast(order.id.toString(), JSON.stringify({ test: 'test' }))
      await this.realtimeSvc.broadcast('test_evt', JSON.stringify({ test: 'test' }))
      const updateOrderDto: IUpdateOrderInput = {
        id: order.id,
        status: OrderStatus.DRIVER_NOT_FOUND
      }
      await this.orderRepo.updateOrder(updateOrderDto)
      return null
      // throw new NotfoundError('Cannot found driver')
    }

    // Update order API
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

    // Update driver login session API
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

  // async getSuitableDriver (order: IProcessBookingOrderDTO): Promise<any> {
  //   console.log('getSuitableDriver here-----------')
  //   // TODO Find ALL driver with filter API
  //   // const availableDrivers = await Driver.findAll({
  //   //   where: {
  //   //     vehicleType: booking.bookingDetail.vehicleType
  //   //   },
  //   //   include: [
  //   //     {
  //   //       model: DriverLogginSession,
  //   //       as: 'driverLoginSession',
  //   //       where: {
  //   //         status: 'ONLINE',
  //   //         drivingStatus: 'WAITING_FOR_CUSTOMER'
  //   //       }
  //   //     },
  //   //     {
  //   //       model: Vehicle,
  //   //       as: 'vehicle'
  //   //     }
  //   //   ]
  //   // })
  //   const availableDrivers = await this.driverRepo.getAvailableDrivers(order.orderDetail.vehicleType)
  //   if (!availableDrivers || availableDrivers.length === 0) {
  //     return { driver: null }
  //   }

  //   const { driver, minDistance, totalPrice } = await this.getNearestDriver(order, availableDrivers)
  //   if (!driver) {
  //     return { driver: null }
  //   }

  //   return {
  //     driver,
  //     minDistance,
  //     totalPrice
  //   }
  // }

  // async getNearestDriver (order: IProcessBookingOrderDTO, availableDrivers: IDriver[]): Promise<any> {
  //   let suitableDriverIdx = -1
  //   let minDistance = Number.MAX_SAFE_INTEGER

  //   availableDrivers.forEach((driver: IDriver, idx: number) => {
  //     const { orderDetail } = order
  //     const { onlineSession } = driver
  //     if (!onlineSession) {
  //       return null
  //     }

  //     const userPosition = {
  //       lat: orderDetail.pickupLatitude,
  //       long: orderDetail.pickupLongitude
  //     }

  //     const driverPosition = {
  //       lat: parseFloat(onlineSession.currentLatitude),
  //       long: parseFloat(onlineSession.currentLongitude)
  //     }

  //     // Calculate distance from driver and user
  //     const distanceFromUserToDriver = getDistanceFromLatLonInKm(userPosition, driverPosition)
  //     console.log('distanceFromUserToDriver----', distanceFromUserToDriver)
  //     if (distanceFromUserToDriver < minDistance) {
  //       minDistance = distanceFromUserToDriver
  //       suitableDriverIdx = idx
  //     }
  //   })

  //   if (suitableDriverIdx === -1) {
  //     return { driver: null }
  //   }

  //   const { orderDetail } = order
  //   const startPosition = {
  //     lat: orderDetail.pickupLatitude,
  //     long: orderDetail.pickupLongitude
  //   }
  //   const endPosition = {
  //     lat: orderDetail.returnLatitude,
  //     long: orderDetail.returnLongitude
  //   }
  //   const startToEndDistance = getDistanceFromLatLonInKm(startPosition, endPosition)
  //   const totalPrice = startToEndDistance * 10000 // 10000 each km

  //   return {
  //     driver: availableDrivers[suitableDriverIdx],
  //     minDistance,
  //     totalPrice
  //   }
  // }
}