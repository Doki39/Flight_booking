import express from 'express'
import { flights } from "../Data/flightsData.js";
import cors from "cors";
import citiesRoute from './routes/cities.js'
import { connectDB } from './dbConnection.js';
import { FindCursor } from 'mongodb';
import searchRoute from "./routes/search.js";
import flightsRoute from "./routes/flights.js";

const app = express()
const port = 3000
const corsOptions = {
origin: ['http://localhost:5173', 'http://example.com', 'http://mydomain.com']
};
app.use(express.json());
app.use(cors(corsOptions));      
app.use(express.json());


let db = await connectDB();

app.use('/api/cities', citiesRoute)
app.use('/api/search', searchRoute) 
app.use('/api/flights', flightsRoute)

app.listen(port, () => console.log(`Slusam na portu ${port}`))



























// app.get('/flights', (req,res) => {  
//     let result = flights

//     if(req.query.id){
//         const inputId = Number(req.query.id)
//         result = result.filter(f => f.id === inputId)
//     }

//     if(req.query.price){
//     const maxprice = Number(req.query.price)
//     result = result.filter(f => f.price <= maxprice)
//     }
    
//     if(req.query.departure){
//     const dep = req.query.departure.toLowerCase()
//     result = result.filter(f => f.departure.toLowerCase() === dep)
//     }

//     if(req.query.destination){
//     const des = req.query.destination.toLowerCase()
//     result = result.filter(f => f.destination.toLowerCase() === des)
//     }

//     if(req.query.airline){
//     const aline = req.query.airline.toLowerCase()
//     result = result.filter(f => f.airline.toLowerCase() === aline)
//     }  

//     if(req.query.layovers) {
//     const count = Number(req.query.layovers)
//     result = result.filter(f => f.layovers.length === count)
//     }

//     res.json(result)
// })

app.get('/flights', async (req,res) =>{
    let flights_collection = db.collection('users');
    let allFlights = await flights_collection.find().toArray();
    res.status(200).json(allFlights)
})

app.post('/flights', (req,res) => {

    if(!req.body){
        return res.status(400).json({ error: "Missing flight data!"})
    }
    const newFlight = req.body
    newFlight.id = flights.length > 0 ? flights[flights.length - 1].id + 1 : 1;


    flights.push(newFlight)

    res.status(201).json({ message: "Successfully added!", flight: newFlight})
})

app.delete('/flights/:id', (req,res) => {
    const id = Number(req.params.id)

    const index = flights.findIndex(f => f.id === id)

    if (index === -1 ){
    return res.status(404).json({ error: "Flight not found!"})
    }

    const deleteFlight = flights.splice(index,1)

    res.json({
        message: "Flight deleted successfully",
        deleted: deleteFlight[0]
    })
})

app.patch('/flights/:id', (req,res) => {
    const id = Number(req.params.id)
    const flight = flights.find(f => f.id === id)

    if(!flight){
        return res.status(404).json({ error: "Flight not found!"})
    }

    Object.assign(flight,req.body)

    res.json({
        message: "Updated successfuly",
        updatedFlight: flight
    })
})

app.put('/flights/:id', (req,res) => {
    const id = Number(req.params.id)
    const flight = flights.findIndex(f => f.id === id)

    if(!flight){
        return res.status(404).json({ error: "Flight not found"})
    }

    const updatedFlight = {
        id,
        ...req.body
    }

    flights[flight] = updatedFlight

    res.json({
        message: "Replaced successfuly",
        replacedFlight: flight
    })
})





