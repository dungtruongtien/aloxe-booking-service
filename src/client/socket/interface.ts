export interface IRealtimeSvc {
  connect: () => any
  onConnection: () => any
  broadcast: (evt: string, msg: string) => any
  listen: (evt: string, callback: (msg: string) => any) => any
}
