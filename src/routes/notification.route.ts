/* eslint @typescript-eslint/no-unsafe-argument: 0 */ // --> OFF

import express, { type Router } from 'express'
import BookingRestController from '../controller/booking/booking.controller.rest'

export const createNotificationRoute = (): Router => {
  const router = express.Router()

  const bookingController = new BookingRestController()

  router.post('/broadcast', bookingController.processBookingOrder.bind(bookingController))

  bookingController.processBookingOrderSub()
  return router
}
