import axios from 'axios'
import { INTERNAL_TOKEN } from '../../common/constant'
import { type IUpdateDriverLoginSession, type IDriverRepo } from './drive.interface'
import { type IDriver, type IDriverOnlineSession } from './drive.schema'

export class DriverRepository implements IDriverRepo {
  async updateDriverOnlineSession (input: IUpdateDriverLoginSession): Promise<IDriverOnlineSession> {
    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: 'http://localhost:4003/api/drivers/online-session',
      headers: {
        authorization: INTERNAL_TOKEN
      },
      data: input
    }

    const response = await axios.request(config)
    return response.data.data as IDriverOnlineSession
  }

  async getAvailableDrivers (vehicleType: number): Promise<IDriver[]> {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `http://localhost:4003/api/drivers/available-drivers?${vehicleType}`,
      headers: {
        authorization: INTERNAL_TOKEN
      }
    }

    const response = await axios.request(config)
    return response.data.data as IDriver[]
  }
}
