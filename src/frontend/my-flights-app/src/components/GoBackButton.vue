<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <button
    type="button"
    @click="goBack"
    class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors"
  >
    ← Go Back
  </button>
</template>