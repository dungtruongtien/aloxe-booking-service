import { RealtimeSvc } from '../client/socket'

export class BaseService {
  protected realtimeSvc
  constructor () {
    if (!this.realtimeSvc) {
      this.realtimeSvc = new RealtimeSvc()
    }
    // this.realtimeSvc = { broadcast: (input: any, input2: any) => { return null } }
  }
}
