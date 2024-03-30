export interface Order {
  id: number
  code: string
  totalPrice: number
  startTime: Date
  endTime: Date
  status: number
  driverId: number | null
  supportStaffId: number | null
  customerId: number
  createdAt: Date
  updatedAt: Date
}
