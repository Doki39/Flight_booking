<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const submitLogin = async () => {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password.'
    return
  }

  loading.value = true

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.message || 'Login failed')
    }

    if (!data.token || !data.user) {
      throw new Error('Invalid login response from server')
    }

    authStore.setAuth(data.token, data.user)

    router.push('/')
  } catch (e) {
    error.value = e.message || 'Something went wrong while logging in.'
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center from-blue-500 via-sky-400 to-indigo-500 px-4">
    <div class="w-full max-w-md bg-white/90 backdrop-blur shadow-xl rounded-2xl p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Log in to your account
      </h1>

      <form @submit.prevent="submitLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your password"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 mt-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? 'Logging in...' : 'Log in' }}
        </button>
      </form>

      <button
        type="button"
        @click="goToRegister"
        class="mt-6 w-full text-center text-sm text-blue-600 hover:text-blue-700 underline"
      >
        Don't have an account? Register here
      </button>
    </div>
  </div>
</template>

