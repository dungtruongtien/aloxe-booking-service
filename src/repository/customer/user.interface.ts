import { type ICustomer } from './user.schema'

export interface ICustomerRepo {
  getCustomer: (id: number) => Promise<ICustomer | null>
}
