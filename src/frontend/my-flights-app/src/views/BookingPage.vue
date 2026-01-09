<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const flightId = route.params.flightId
const flight = ref(null)
const passenger = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})


const fetchFlight = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/flights/${flightId}`)
    if (!res.ok) throw new Error('Flight not found')
    flight.value = await res.json()
  } catch (err) {
    console.error(err)
    alert('Error fetching flight data')
    router.push('/')
  }
}

const submitBooking = async () => {
  if (!passenger.value.firstName || !passenger.value.lastName || !passenger.value.email) {
    alert('Please fill in all required fields')
    return
  }

  try {
    const res = await fetch(`http://localhost:3000/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flightId,
        passenger: passenger.value
      })
    })
    if (!res.ok) throw new Error('Booking failed')

    alert('Booking successful! Proceed to payment.')
    router.push('/') 
  } catch (err) {
    console.error(err)
    alert('Booking failed')
  }
}

onMounted(fetchFlight)
</script>

<template>
  <div v-if="flight" class="max-w-xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Booking for {{ flight.departure }} → {{ flight.destination }}</h1>

    <div class="space-y-4">
      <input v-model="passenger.firstName" placeholder="First Name" class="input" />
      <input v-model="passenger.lastName" placeholder="Last Name" class="input" />
      <input v-model="passenger.email" placeholder="Email" type="email" class="input" />
      <input v-model="passenger.phone" placeholder="Phone" type="tel" class="input" />

      <button @click="submitBooking" class="bg-green-600 text-white px-4 py-2 rounded">
        Book Flight
      </button>
    </div>
  </div>

  <p v-else>Loading flight info...</p>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
