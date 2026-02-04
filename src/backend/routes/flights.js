import express from 'express'
import { connectDB } from '../dbConnection.js'
import { ObjectId } from 'mongodb'

const router = express.Router()

const db = await connectDB()
const flights_collection = db.collection('flights');

router.get('/', async (req, res) => {
  const { departure, destination } = req.query;
  
  if (!departure || !destination) {
    return res.status(400).json({ message: "Departure or destination missing" });
  }

  try {
    const matchingFlights = await flights_collection.find({
      departure: { $regex: departure, $options: 'i' },
      destination: { $regex: destination, $options: 'i' }
    }).toArray();

    res.status(200).json(matchingFlights);

  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});

router.get('/all', async (_req, res) => {
  try {
    const allFlights = await flights_collection.find({}).toArray()
    res.status(200).json(allFlights)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch flights', error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const flight = await flights_collection.findOne({ _id: new ObjectId(id) })
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' })
    }
    res.status(200).json(flight)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch flight', error: err.message })
  }
})

router.post('/', async (req, res) => {
  const db = await connectDB()
  let {
    departure,
    destination,
    departureDateTime,
    arrivalDateTime,
    layovers,
    airline,
    baggageAllowance,
    onboard,
    price
  } = req.body
  
  if (typeof layovers === 'string') {
    layovers = layovers.split(',').map(s => s.trim())
  } else if (!Array.isArray(layovers)) {
    layovers = []
  }

  if (typeof onboard === 'string') {
    onboard = onboard.split(',').map(s => s.trim())
  } else if (!Array.isArray(onboard)) {
    onboard = []
  }
  price = Number(price)

  if (
    !departure || typeof departure !== 'string' ||
    !destination || typeof destination !== 'string' ||
    !departureDateTime || isNaN(Date.parse(departureDateTime)) ||
    !arrivalDateTime || isNaN(Date.parse(arrivalDateTime)) ||
    !Array.isArray(layovers) ||
    !airline || typeof airline !== 'string' ||
    !baggageAllowance || typeof baggageAllowance !== 'string' ||
    !Array.isArray(onboard) ||
    !price || typeof price !== 'number'
  ) {
    return res.status(400).json({ message: 'Invalid or missing flight data' })
  }

  try {
    const flights_collection = db.collection('flights')
    const durationMinutes = Math.floor((new Date(arrivalDateTime) - new Date(departureDateTime)) / 60000)

    const result = await flights_collection.insertOne({
      departure,
      destination,
      departureDateTime: new Date(departureDateTime),
      arrivalDateTime: new Date(arrivalDateTime),
      durationMinutes,
      layovers,
      airline,
      baggageAllowance,
      onboard,
      price,
    });

    res.status(201).json({ message: 'Flight added successfully', flightId: result.insertedId })
  } catch (err) {
    res.status(500).json({ message: 'Failed to add flight', error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await flights_collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Flight not found' })
    }

    res.status(200).json({ message: 'Flight deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete flight', error: err.message })
  }
})

export default router
