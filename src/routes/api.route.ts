import express from 'express'
import bookingRouterHandler from './booking.route'

const router = express.Router()

router.use('/booking', bookingRouterHandler)

export default router
