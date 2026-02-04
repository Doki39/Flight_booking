<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const submitRegister = async () => {
  error.value = ''
  success.value = ''

  if (!email.value || !password.value || !name.value) {
    error.value = 'Please fill out all fields.'
    return
  }

  loading.value = true

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value
      })
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.message || 'Registration failed')
    }

    success.value = data.message || 'Registration successful! You can now log in.'

    setTimeout(() => {
      router.push('/login')
    }, 800)
  } catch (e) {
    error.value = e.message || 'Something went wrong while registering.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-sky-400 to-indigo-500 px-4">
    <div class="w-full max-w-md bg-white/90 backdrop-blur shadow-xl rounded-2xl p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">
        Create your account
      </h1>

      <form @submit.prevent="submitRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Full name
          </label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Doe"
          />
        </div>

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
            placeholder="Create a password"
          />
        </div>

        <p v-if="error" class="text-sm text-red-600">
          {{ error }}
        </p>
        <p v-if="success" class="text-sm text-green-600">
          {{ success }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 mt-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        Already have an account?
        <router-link to="/login" class="text-blue-600 hover:text-blue-700 underline">
          Log in here
        </router-link>
      </p>
    </div>
  </div>
</template>

