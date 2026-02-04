<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
 import { useAuthStore } from '../stores/authStore'
import GoBackButton from '../components/GoBackButton.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const flightId = route.params.flightId
const flight = ref(null)
const passenger = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})
const loading = ref(false)
const error = ref('')

const fetchFlight = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/flights/${flightId}`)
    if (!res.ok) throw new Error('Flight not found')
    flight.value = await res.json()
  } catch (err) {
    console.error(err)
    error.value = 'Error fetching flight data'
    setTimeout(() => router.push('/'), 2000)
  }
}

const formatDate = (d) => {
  if (!d) return '—'
  const date = new Date(d)
  return date.toLocaleString()
}

const submitBooking = async () => {
  if (!passenger.value.firstName || !passenger.value.lastName || !passenger.value.email) {
    alert('Please fill in First Name, Last Name and Email')
    return
  }

  if (!authStore.token) {
    alert('Please log in to complete your booking.')
    router.push('/login')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const res = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        flightId,
        passenger: passenger.value
      })
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.message || 'Booking failed')
    }

    router.push(`/payment/${data.bookingId}`)
  } catch (err) {
    console.error(err)
    error.value = err.message || 'Booking failed'
  } finally {
    loading.value = false
  }
}

onMounted(fetchFlight)
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4">
    <GoBackButton />

    <div v-if="flight" class="max-w-xl mx-auto mt-4">
      <h1 class="text-2xl font-bold mb-4">Confirm booking</h1>

      <div class="bg-white border rounded-lg p-4 mb-6 shadow-sm">
        <h2 class="font-semibold text-lg mb-2">Flight details</h2>
        <p class="text-gray-700">{{ flight.departure }} → {{ flight.destination }}</p>
        <p class="text-sm text-gray-600">Departure: {{ formatDate(flight.departureDateTime) }}</p>
        <p class="text-sm text-gray-600">Arrival: {{ formatDate(flight.arrivalDateTime) }}</p>
        <p class="text-sm text-gray-600">Airline: {{ flight.airline }}</p>
        <p class="text-sm text-gray-600">Baggage: {{ flight.baggageAllowance }}</p>
        <p class="font-semibold mt-2">Price: ${{ flight.price }}</p>
      </div>

      <div class="bg-white border rounded-lg p-4 shadow-sm">
        <h2 class="font-semibold text-lg mb-3">Your details</h2>
        <div class="space-y-3">
          <input v-model="passenger.firstName" placeholder="First Name *" class="input" />
          <input v-model="passenger.lastName" placeholder="Last Name *" class="input" />
          <input v-model="passenger.email" placeholder="Email *" type="email" class="input" />
          <input v-model="passenger.phone" placeholder="Phone" type="tel" class="input" />
        </div>

        <p v-if="error" class="text-red-600 text-sm mt-2">{{ error }}</p>

        <button
          @click="submitBooking"
          :disabled="loading"
          class="mt-4 w-full bg-green-600 text-white py-2 rounded font-medium disabled:opacity-60"
        >
          {{ loading ? 'Booking...' : 'Confirm booking & proceed to payment' }}
        </button>
      </div>
    </div>

    <p v-else-if="!error" class="text-center mt-8">Loading flight info...</p>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
