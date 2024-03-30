export interface IDriverOnlineSession {
  id: number
  driverId: number
  currentLongitude: string
  currentLatitude: string
  onlineStatus: number
  workingStatus: number
  createdAt: Date
  updatedAt: Date
}

export interface IDriver {
  id: number
  bookingType: number
  driverNo: string
  vehicleType: number
  userId: number
  createdAt: Date | null
  updatedAt: Date | null
  vehicle?: IVehicle
  onlineSession: IDriverOnlineSession
}

export interface IVehicle {
  id: number
  model: string | null
  licensePlate: string | null
  driverId: number
  createdAt: Date
  updatedAt: Date
}
