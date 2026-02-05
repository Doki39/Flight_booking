import { createRouter, createWebHistory } from 'vue-router'
import AddFlightPage from '../views/AddFlightPage.vue'
import FrontPage from '../views/FrontPage.vue'
import BookingPage from '../views/BookingPage.vue'
import LogInPage from '../views/LogInPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import RemoveFlightPage from '../views/RemoveFlightPage.vue'
import Payment from '../views/Payment.vue'
import DestinationsPage from '../views/DestinationsPage.vue'

const routes = [
  { path: '/', component: FrontPage },
  { path: '/flights/add', component: AddFlightPage },
  { path: '/flights/remove', component: RemoveFlightPage },
  { path: '/booking/:flightId', component: BookingPage },
  { path: '/payment/:bookingId', component: Payment },
  { path: '/destinations', component: DestinationsPage },
  { path: '/login', component: LogInPage },
  { path: '/register', component: RegisterPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
