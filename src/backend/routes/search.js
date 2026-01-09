import express from 'express'
import { connectDB } from '../dbConnection.js'

const router = express.Router()


router.post('/', async (req, res) => {
  const { departure, destination } = req.body;
  let db = await connectDB();
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

export default router;
