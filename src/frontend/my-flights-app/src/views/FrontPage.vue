<script setup>
import FlightsHeader from '../components/FlightsHeader.vue'
import FlightsBody from '../components/FlightsBody.vue'
import FlightsFooter from '../components/FlightsFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <FlightsHeader />
    <div class="flex-1">
      <FlightsBody />
    </div>
    <FlightsFooter />
  </div>
</template>