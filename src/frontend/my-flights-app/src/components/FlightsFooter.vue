<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="w-full border-t-2 border-blue-800 bg-blue-600 px-6 py-4 mt-8">
    <div
      class="max-w-5xl mx-auto full-height flex flex-col md:flex-row items-center justify-between text-white text-sm"
    >
      <div class="mb-2 md:mb-0">
        © {{ year }} My Flights App. All rights reserved.
      </div>
      <div class="flex gap-4">
        <span>Support: randomgmail@gmail.com</span>
        <span>Phone: +123 456 789</span>
      </div>
    </div>
  </footer>
</template>

