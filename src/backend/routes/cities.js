import express from 'express'
import { connectDB } from '../dbConnection.js'

const router = express.Router()
const db = await connectDB()

router.get('/', async (req, res) => {
  try {
    const q = req.query.q || ''

    if (q.length < 2) {
      return res.json([])
    }

    const cities = await db
      .collection('cities')
      .find({
        name: { $regex: `^${q}`, $options: 'i' }
      })
      .limit(10)
      .toArray()

    res.json(cities)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cities' })
  }
})

export default router
