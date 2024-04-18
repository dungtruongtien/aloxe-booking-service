export interface IProcessBookingOrderDTO {
  id: number
  customerId: number
  supportStaffId: number
  code: string
  status: number
  startTime: string
  endTime: string
  totalPrice: number
  orderDetail: {
    vehicleType: number
    pickupLongitude: number
    pickupLatitude: number
    returnLongitude: number
    returnLatitude: number
    voucherCode: string
    pickupLocation: string
    returnLocation: string
    description: ''
  }
}
