import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFlightStore = defineStore('flight', () => {
  const selectedFlight = ref(null)

  const setFlight = (flight) => {
    selectedFlight.value = flight
  }

  const clearFlight = () => {
    selectedFlight.value = null
  }

  return {
    selectedFlight,
    setFlight,
    clearFlight
  }
})
