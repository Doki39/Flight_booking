<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import GoBackButton from '../components/GoBackButton.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const bookingId = route.params.bookingId
const paying = ref(false)
const error = ref('')

const card = ref({
  number: '',
  expiry: '',
  cvv: '',
  name: ''
})

onMounted(() => {
  if (!bookingId) {
    router.push('/')
  }
  if (!authStore.token) {
    router.push('/login')
  }
})

const payForBooking = async () => {
  if (!bookingId || !authStore.token) {
    error.value = 'Missing booking or login.'
    return
  }

  paying.value = true
  error.value = ''

  try {
    const res = await fetch('http://localhost:3000/api/paidBookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`
      },
      body: JSON.stringify({ bookingId })
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.message || 'Payment failed')
    }

    alert('Payment successful! Thank you.')
    router.push('/')
  } catch (err) {
    error.value = err.message || 'Payment failed'
  } finally {
    paying.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4">
    <GoBackButton />

    <div class="max-w-md mx-auto mt-6 bg-white border rounded-xl shadow-sm p-6">
      <h1 class="text-2xl font-bold mb-2">Payment</h1>
      <p class="text-gray-600 text-sm mb-6">Complete payment for your booking (demo – no real charge).</p>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Name on card</label>
          <input
            v-model="card.name"
            type="text"
            placeholder="John Doe"
            class="input"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Card number</label>
          <input
            v-model="card.number"
            type="text"
            placeholder="1234 5678 9012 3456"
            maxlength="19"
            class="input"
          />
        </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
            <input
              v-model="card.expiry"
              type="text"
              placeholder="12/25"
              maxlength="5"
              class="input"
            />
          </div>
          <div class="w-24">
            <label class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <input
              v-model="card.cvv"
              type="text"
              placeholder="123"
              maxlength="4"
              class="input"
            />
          </div>
        </div>
      </div>

      <p v-if="error" class="text-red-600 text-sm mt-3">{{ error }}</p>

      <button
        @click="payForBooking"
        :disabled="paying"
        class="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
      >
        {{ paying ? 'Processing...' : 'Pay for booking' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
}
.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}
</style>
