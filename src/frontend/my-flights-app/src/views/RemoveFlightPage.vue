<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import GoBackButton from '../components/GoBackButton.vue'
const authStore = useAuthStore()
const router = useRouter()

const flights = ref([])
const loading = ref(false)
const error = ref('')

const fetchFlights = async () => {
  loading.value = true
  error.value = ''

  try {
    const token = authStore.token
    const res = await fetch('http://localhost:3000/api/flights/all', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || 'Failed to load flights')
    }

    flights.value = await res.json()
  } catch (e) {
    error.value = e.message || 'Failed to load flights'
  } finally {
    loading.value = false
  }
}

const removeFlight = async (flightId) => {
  if (!confirm('Are you sure you want to remove this flight?')) {
    return
  }

  try {
    const token = authStore.token
    const res = await fetch(`http://localhost:3000/api/flights/${flightId}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || 'Failed to delete flight')
    }

    flights.value = flights.value.filter(f => f._id !== flightId)
  } catch (e) {
    alert(e.message || 'Failed to delete flight')
  }
}

onMounted(() => {
  if (!authStore.isAdmin) {
    router.push('/')
    return
  }

  fetchFlights()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4">
    <GoBackButton></GoBackButton>
    <div class="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-bold mb-4">Remove Flights</h1>

      <p v-if="loading">Loading flights...</p>
      <p v-if="error" class="text-red-600 mb-4">{{ error }}</p>

      <div v-if="!loading && flights.length === 0 && !error">
        No flights found.
      </div>

      <ul v-if="!loading && flights.length > 0" class="space-y-4">
        <li
          v-for="flight in flights"
          :key="flight._id"
          class="border rounded p-4 flex items-center justify-between"
        >
          <div>
            <div class="font-semibold">
              {{ flight.departure }} → {{ flight.destination }}
            </div>
            <div class="text-sm text-gray-600">
              Airline: {{ flight.airline }} |
              Price: ${{ flight.price }}
            </div>
          </div>
          <button
            @click="removeFlight(flight._id)"
            class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Remove
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

