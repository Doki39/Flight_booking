<script setup>
import { computed } from 'vue'
import { useFlightStore } from '../stores/flightStore.js'
import FlightsPageButton from '../components/FlightsPageButton.vue'
import { useRouter } from 'vue-router'

const flightStore = useFlightStore()
const router = useRouter()
const flight = computed(() => flightStore.selectedFlight) 

const submitFlight = async () => {
  if (!flight.value) return

  try {
    const res = await fetch('http://localhost:3000/api/flights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flight.value)
    })

    if (!res.ok) throw new Error('Failed to save flight')

    alert('Flight saved successfully!')
    flightStore.clearFlight() 
  } catch (err) {
    console.error(err)
    alert('Error saving flight. Missing data')
  }
}

const goToFrontPage = () => {
  router.push('/') 
}
</script>

<template>
  <div v-if="flight" class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Add Flight</h1>

    <div class="space-y-4">

      <input v-model="flight.departure" placeholder="Departure" class="input" />
      <input v-model="flight.destination" placeholder="Destination" class="input" />

      <input type="datetime-local" v-model="flight.departureDateTime" class="input" />
      <input type="datetime-local" v-model="flight.arrivalDateTime" class="input" />
      <input v-model="flight.layover" placeholder="Layover" class="input">
      <input v-model="flight.onboard" placeholder="onboard" class="input">
      <input v-model="flight.airline" placeholder="Airline" class="input" />
      <input v-model="flight.baggageAllowance" placeholder="Baggage Allowance" class="input" />

      <input type="number" v-model="flight.price" placeholder="Price" class="input" />

      <button 
        type="button" 
        @click="submitFlight" 
        class="bg-green-600 text-white px-4 py-2 rounded"
        >
        Save Flight
      </button>

    </div>
  </div>

  <div v-else class="text-center mt-6 px-5 py-3">
    <div>Flight added</div>
    <FlightsPageButton>Add another flight</FlightsPageButton>
    <button @click="goToFrontPage" class="px-5 my-5 mx-5">Go back</button>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
