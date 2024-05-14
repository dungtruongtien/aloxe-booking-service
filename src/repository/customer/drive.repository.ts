import axios from 'axios'
import { INTERNAL_TOKEN } from '../../common/constant'
import { type ICustomerRepo } from './user.interface'
import { type ICustomer } from './user.schema'

export class CustomerRepository implements ICustomerRepo {
  async getCustomer (id: number): Promise<ICustomer | null> {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://localhost:4003/api/users/${id}`,
      headers: {
        authorization: INTERNAL_TOKEN
      }
    }

    const response = await axios.request(config)
    return response.data.data as ICustomer | null
  }
}
