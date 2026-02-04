import express from 'express'
import { connectDB } from '../dbConnection.js'
import { ObjectId } from 'mongodb'
import { authMiddleware } from './auth.js'

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  try {
    const db = await connectDB()
    const paidBookings = db.collection('paidBookings')
    const bookings = db.collection('bookings')

    const userId = req.user.id
    const { bookingId } = req.body

    if (!bookingId) {
      return res.status(400).json({ message: 'Missing bookingId' })
    }

    const booking = await bookings.findOne({ _id: new ObjectId(bookingId) })
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    const doc = {
      bookingId: new ObjectId(bookingId),
      createdAt: new Date()
    }

    const result = await paidBookings.insertOne(doc)
    const paidBookingId = result.insertedId

    res.status(201).json({
      message: 'Payment successful',
      paidBookingId: paidBookingId.toString(),
      bookingId,
      userId
    })
  } catch (err) {
    res.status(500).json({ message: 'Payment failed', error: err.message })
  }
})

export default router
