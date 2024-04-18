export interface INotificationService {
  broadcast: (msgId: string, content: string) => any
}
