/* eslint "@typescript-eslint/no-misused-promises": 0 */ // --> OFF
/* eslint @typescript-eslint/unbound-method: 0 */ // --> OFF
/* eslint @typescript-eslint/no-unsafe-argument: 0 */ // --> OFF

import express from 'express'
import BookingRestController from '../controller/booking.controller.rest'
const router = express.Router()

const bookingController = new BookingRestController()

router.post('/process-booking', bookingController.processBookingOrder.bind(bookingController))

export default router
