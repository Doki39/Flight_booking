import express from 'express'
import { connectDB } from '../dbConnection.js'
import { ObjectId } from 'mongodb'
import { authMiddleware } from './auth.js'

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  try {
    const db = await connectDB()
    const bookings = db.collection('bookings')

    const userId = req.user.id
    const { flightId, passenger } = req.body

    if (!flightId || !passenger) {
      return res.status(400).json({ message: 'Missing flightId or passenger details' })
    }

    const bookingDoc = {
      userId: new ObjectId(userId),
      flightId: new ObjectId(flightId),
      passenger: {
        firstName: passenger.firstName || '',
        lastName: passenger.lastName || '',
        email: passenger.email || '',
        phone: passenger.phone || ''
      },
      createdAt: new Date()
    }

    const result = await bookings.insertOne(bookingDoc)

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId: result.insertedId.toString()
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to create booking', error: err.message })
  }
})

export default router
