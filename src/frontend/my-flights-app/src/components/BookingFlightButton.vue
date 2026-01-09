<script setup>
import { useRouter } from 'vue-router'
import { useFlightStore } from '../stores/flightStore.js'

const router = useRouter()
const flightStore = useFlightStore()

const bookFlight = () => {
    
  flightStore.setFlight({
    departure: '',
    destination: '',
    departureDateTime: '',
    arrivalDateTime: '',
    durationMinutes: '',
    airline: '',
    baggageAllowance: '',
    price: '',
    layovers: [],
    onboard: []
  })

  router.push('/flights/book')
}
</script>

<template>
  <button
    @click="bookFlight"
    class="px-4 py-2 bg-blue-600 text-white rounded"
  >
    Add Flight
  </button>
</template>
