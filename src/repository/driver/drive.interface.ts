import { type IDriver, type IDriverOnlineSession } from './drive.schema'

export enum DriverOnlineSessionOnlineStatusEnum {
  ONLINE = 1,
  OFFLINE = 2
}

export enum DriverOnlineSessionWorkingStatusEnum {
  WAITING_FOR_CUSTOMER = 1,
  DRIVING = 2
}

export interface IUpdateDriverLoginSession {
  driverId: number
  currentLongitude?: number | string
  currentLatitude?: number | string
  onlineStatus?: number
  workingStatus?: number
}

export interface IDriverRepo {
  updateDriverOnlineSession: (input: IUpdateDriverLoginSession) => Promise<IDriverOnlineSession>
  getAvailableDrivers: (vehicleType: number) => Promise<IDriver[]>
}
