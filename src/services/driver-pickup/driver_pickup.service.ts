// Main strategy
//  Picking driver based on free state
//  Picking driver based on location and free state
//  Picking driver based on location and feedback

import { type IDriver } from '../../repository/driver/drive.schema'
import { getDistanceFromLatLonInKm } from '../../utils/distance'
import { type IProcessBookingOrderDTO } from '../booking/booking.dto'
import { type IGetSuitableDriverResp, type IDriverPickupStrategy } from './driver_pickup.interface'

export class DriverPickingStrategy {
  private readonly strategy: IDriverPickupStrategy
  constructor (strategy: IDriverPickupStrategy) {
    this.strategy = strategy
  }

  pickup = async (order: IProcessBookingOrderDTO, drivers: IDriver[]): Promise<IGetSuitableDriverResp> => {
    return await this.strategy.pickup(order, drivers)
  }
}

export class DriverPickingBasedLocationAndState implements IDriverPickupStrategy {
  pickup = async (order: IProcessBookingOrderDTO, drivers: IDriver[]): Promise<IGetSuitableDriverResp> => {
    console.log('getSuitableDriver here-----------')
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

    // const availableDrivers = await this.driverRepo.getAvailableDrivers(order.orderDetail.vehicleType)
    // if (!availableDrivers || availableDrivers.length === 0) {
    //   return { driver: null }
    // }

    const { driver, minDistance, totalPrice } = await this.getNearestDriver(order, drivers)
    if (!driver) {
      return {
        driver: null,
        minDistance: 0,
        totalPrice: 0
      }
    }

    return {
      driver,
      minDistance,
      totalPrice
    }
  }

  async getNearestDriver (order: IProcessBookingOrderDTO, availableDrivers: IDriver[]): Promise<IGetSuitableDriverResp> {
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

    if (suitableDriverIdx === -1) {
      return {
        driver: null,
        minDistance: 0,
        totalPrice: 0
      }
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

export class DriverPickingBasedLocationAndFeedback { // TODO: Implement this logic later
  private readonly strategy: IDriverPickupStrategy
  constructor (strategy: IDriverPickupStrategy) {
    this.strategy = strategy
  }

  pickup = async (order: IProcessBookingOrderDTO, drivers: IDriver[]): Promise<IGetSuitableDriverResp> => {
    return {
      driver: null,
      minDistance: 0,
      totalPrice: 0
    }
  }
}
