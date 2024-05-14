/* eslint @typescript-eslint/no-unsafe-argument: 0 */ // --> OFF

import express, { type Router } from 'express'
import NotificationRestController from '../controller/notification/notification.controller.rest'

export const createNotificationRoute = (): Router => {
  const router = express.Router()

  const notificationRestController = new NotificationRestController()

  router.post('/broadcast', notificationRestController.broadcast.bind(notificationRestController))
  return router
}
