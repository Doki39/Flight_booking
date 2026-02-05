<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHotels = () => {
  alert('Hotels page coming soon!')
}

const goToCars = () => {
  alert('Cars page coming soon!')
}

const goToDestinations = () => {
  router.push('/destinations')
}
</script>

<template>
  <div class="w-full px-6 py-6 bg-gray-50">
    <div class="flex justify-center gap-4">
      <button
        type="button"
        @click="goToHotels"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Hotels
      </button>

      <button
        type="button"
        @click="goToCars"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Cars
      </button>

      <button
        type="button"
        @click="goToDestinations"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Display all destinations
      </button>
    </div>
  </div>
</template>

