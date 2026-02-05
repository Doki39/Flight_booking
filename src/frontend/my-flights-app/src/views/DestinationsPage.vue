<script setup>
import GoBackButton from '../components/GoBackButton.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-6 px-4">
    <GoBackButton />

    <div class="max-w-4xl mx-auto mt-4">
      <h1 class="text-3xl font-bold mb-6">Popular destinations</h1>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-xl font-semibold mb-1">England</h2>
          <p class="text-sm text-gray-600">
            Explore London, historic castles, and charming countryside towns.
          </p>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-xl font-semibold mb-1">Croatia</h2>
          <p class="text-sm text-gray-600">
            Crystal-clear Adriatic sea, Dubrovnik walls, and beautiful islands.
          </p>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-xl font-semibold mb-1">Germany</h2>
          <p class="text-sm text-gray-600">
            From Berlin’s culture to Bavarian mountains and fairytale castles.
          </p>
        </div>

        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-xl font-semibold mb-1">Serbia</h2>
          <p class="text-sm text-gray-600">
            Vibrant Belgrade nightlife, rich history, and Danube river views.
          </p>
        </div>

        <div class="bg-white rounded-lg shadow p-4 md:col-span-2">
          <h2 class="text-xl font-semibold mb-1">Japan</h2>
          <p class="text-sm text-gray-600">
            Mix of ultra-modern cities and traditional temples, cherry blossoms, and unique cuisine.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

