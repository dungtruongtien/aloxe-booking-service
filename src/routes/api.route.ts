import express, { type Router } from 'express'
import { createBookingRoute } from './booking.route'
import { createNotificationRoute } from './notification.route'

export const createRootRoute = (): Router => {
  const router = express.Router()
  const bookingRoute = createBookingRoute()
  const notificationRoute = createNotificationRoute()

  router.use('/booking', bookingRoute)
  router.use('/notification', notificationRoute)
  return router
}
