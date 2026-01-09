import express from 'express'
import { connectDB } from '../dbConnection.js'

const router = express.Router()



router.get('/', async (req, res) => {

    let db = await connectDB();
    
  
});


router.post('/', async (req, res) => {

})

export default router
