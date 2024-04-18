export interface ICustomer {
  id: number
  level: string
  customerNo: string
  userId: number
  createdAt: Date
  updatedAt: Date
  user: IUser
}

export interface IUser {
  id: number
  fullName: string
  phoneNumber: string
  email: string
  address: string | null
  dob: Date | null
  role: number
  status: number
  createdAt: Date
  updatedAt: Date
}
