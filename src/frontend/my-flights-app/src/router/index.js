import { createRouter, createWebHistory } from 'vue-router'
import AddFlightPage from '../views/AddFlightPage.vue'
import FrontPage from '../views/FrontPage.vue'
import BookingPage from '../views/BookingPage.vue'

const routes = [
  { path: '/', component: FrontPage },
  { path: '/flights/add', component: AddFlightPage },
  { path: '/booking', component: BookingPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
