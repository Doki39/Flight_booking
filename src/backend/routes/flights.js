import express from 'express'
import { connectDB } from '../dbConnection.js'

const router = express.Router()



router.get('/', async (req, res) => {
  const { departure, destination } = req.query;
  const db = await connectDB()
  
  if (!departure || !destination) {
    return res.status(400).json({ message: "Departure or destination missing" });
  }

  try {
    const flights_collection = db.collection('flights');

    const matchingFlights = await flights_collection.find({
      departure: { $regex: departure, $options: 'i' },
      destination: { $regex: destination, $options: 'i' }
    }).toArray();

    res.status(200).json(matchingFlights);

  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});


router.post('/', async (req, res) => {
  const db = await connectDB()
  const {
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
    const durationMinutes = Math.floor((new Date(arrivalDateTime) - new Date(departureDateTime)) / 60000);
    const safeLayovers = Array.isArray(layovers) ? layovers : []
    const safeOnboard = Array.isArray(onboard) ? onboard : []
    const result = await flights_collection.insertOne({
      departure,
      destination,
      departureDateTime: new Date(departureDateTime),
      arrivalDateTime: new Date(arrivalDateTime),
      durationMinutes,
      layovers: safeLayovers,
      airline,
      baggageAllowance,
      onboard: safeOnboard,
      price,
    });

    res.status(201).json({ message: 'Flight added successfully', flightId: result.insertedId })
  } catch (err) {
    res.status(500).json({ message: 'Failed to add flight', error: err.message })
  }
})

export default router
