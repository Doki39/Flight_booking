<script setup>
import { ref, watch } from 'vue'
import FlightsPageButton from './FlightsPageButton.vue';

const tripType = ref('round')
const numberOfPassengers = ref(1)
const departureDate = ref('')
const returnDate = ref('')
const directFlight = ref(false)
const departure = ref('')
const destination = ref('')
const flights = ref([])

const departureResults = ref([])
const destinationResults = ref([])

const API_URL = 'http://localhost:3000/api/cities'

const fetchCitiesDeparture = async (query) => {
  if (!query || query.length < 2) {
    departureResults.value = []
    return
  }

  try {
    const res = await fetch(`${API_URL}?q=${query}`)
    departureResults.value = await res.json()
  } catch (err) {
    console.error(err)
    departureResults.value = []
  }
}

const fetchCitiesDestination = async (query) => {
  if (!query || query.length < 2) {
    destinationResults.value = []
    return
  }

  try {
    const res = await fetch(`${API_URL}?q=${query}`)
    destinationResults.value = await res.json()
  } catch (err) {
    console.error(err)
    destinationResults.value = []
  }
}

const searchFlights = async () => {
  const params = new URLSearchParams({
    departure: departure.value,
    destination: destination.value,
    departureDate: departureDate.value,
    tripType: tripType.value,
    directFlight: directFlight.value,
  })

  try {
    const res = await fetch(
      `http://localhost:3000/api/flights?${params.toString()}`
    )

    const result = await res.json()
    flights.value = result
  } catch (err) {
    console.error('Search failed:', err)
  }
}


const bookFlight = async () => {

}




watch(departure, (val) => fetchCitiesDeparture(val))
watch(destination, (val) => fetchCitiesDestination(val))

const selectDepartureCity = (city) => {
  departure.value = city.name
  departureResults.value = []
}
const confirmDepartureCity = () => {
  departureResults.value = []
}

const selectDestinationCity = (city) => {
  destination.value = city.name
  destinationResults.value = []
}
const confirmDestinationCity = () => {
  destinationResults.value = []
}
</script>

<template>
  <header class="w-full border-b-2 border-blue-800 bg-blue-600 px-6 py-4">
    <div class="flex items-center justify-between mb-4">
      <div class="text-2xl font-bold text-white">
        Flight Booking
      </div>
      <button class="bg-white text-blue-600 px-4 py-2 rounded">
        <FlightsPageButton></FlightsPageButton>
      </button>
      <button class="bg-white text-blue-600 px-4 py-2 rounded">
        Log in
      </button>
    </div>

    <div class="flex gap-2 mb-4">
      <button
        class="px-4 py-2 rounded"
        :class="tripType === 'round' ? 'bg-gray-200 text-black' : 'bg-blue-500 text-white'"
        @click="tripType = 'round'"
      >
        Round trip
      </button>

      <button
        class="px-4 py-2 rounded"
        :class="tripType === 'oneway' ? 'bg-gray-200 text-black' : 'bg-blue-500 text-white'"
        @click="tripType = 'oneway'"
      >
        One way
      </button>
    </div>

    <div class="flex gap-4 items-end">

        <div class="relative w-56">
            <label class="block text-sm font-medium text-white">City departure</label>
            <input
            v-model="departure"
            class="border rounded px-3 py-2 w-full"
            placeholder="Start typing..."
            @keydown.enter.prevent="confirmDepartureCity"
            />

            <ul
            v-show="departureResults.length"
            class="absolute bg-white w-full border mt-1 z-10 max-h-40 overflow-auto"
            >
            <li
                v-for="city in departureResults"
                :key="city._id"
                class="px-3 py-2 hover:bg-gray-200 cursor-pointer"
                @mousedown.prevent="selectDepartureCity(city)"
            >
                {{ city.name }}
            </li>
            </ul>
        </div>


      <div class="relative w-56">
        <label class="block text-sm font-medium text-white">Destination</label>
        <input
          v-model="destination"
          class="border rounded px-3 py-2 w-full"
          placeholder="Start typing..."
          @keydown.enter.prevent="confirmDestinationCity"
        />

        <ul v-show="destinationResults.length" 
            class="absolute bg-white w-full border mt-1 z-10  max-h-40 overflow-auto">
          <li
            v-for="city in destinationResults"
            :key="city._id"
            class="px-3 py-2 hover:bg-gray-200 cursor-pointer"
            @mousedown.prevent="selectDestinationCity(city)"
          >
            {{ city.name }}
          </li>
        </ul>
      </div>

      <div>
        <label class="block text-sm font-medium text-white">Departure date</label>
        <input type="date" v-model="departureDate" class="border rounded px-3 py-2" />
      </div>

      <div v-if="tripType === 'round'">
        <label class="block text-sm font-medium text-white">Return date</label>
        <input type="date" v-model="returnDate" class="border rounded px-3 py-2" />
      </div>

      <div>
        <label class="block text-sm font-medium text-white">Passengers</label>
        <input type="number" v-model="numberOfPassengers" class="border rounded px-3 py-2 w-24" />
      </div>
          <div>
        <button @click ="searchFlights" class="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
      </div>

    </div>



    <div class="mt-4 text-white">
      <label>
        <input type="checkbox" v-model="directFlight" /> Direct flight
      </label>
    </div>

    <div v-if="flights.length > 0" class="mt-6">
    <h2 class="text-xl font-bold mb-2">Matching Flights:</h2>
    <ul >
        <li v-for="flight in flights" :key="flight._id" class=" border-2 px-5 py-2">
        <div>{{ flight.departure }} → {{ flight.destination }}</div>
        <div>Price: ${{ flight.price }}</div>
        <div>Departure: {{ flight.departureDateTime }} | Arrival: {{ flight.arrivalDateTime }}
</div>
        <div>Flight duration: {{ flight.durationMinutes }} minutes </div>
        <div>Airline: {{ flight.airline }}</div>
        <div>baggage allowance {{ flight.baggageAllowance }}</div>
        <button @click ="bookFlight" class="bg-blue-500 text-white px-4 py-2 rounded">Book flight</button>
        </li>
    </ul>
    </div>
    <div v-if="flights.length === 0" class="mt-6">
      <div>No flight found! Try different city</div>
    </div>
  </header>
</template>
