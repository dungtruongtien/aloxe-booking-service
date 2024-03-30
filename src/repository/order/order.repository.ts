import axios from 'axios'
import { INTERNAL_TOKEN } from '../../common/constant'
import { type IOrderRepo, type IUpdateOrderInput } from './order.interface'
import { type Order } from './order.schema'

export class OrderRepository implements IOrderRepo {
  async updateOrder (input: IUpdateOrderInput): Promise<Order> {
    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: 'http://localhost:4002/api/orders',
      headers: {
        authorization: INTERNAL_TOKEN
      },
      data: input
    }

    const response = await axios.request(config)
    return response.data.data as Order
  }
}
