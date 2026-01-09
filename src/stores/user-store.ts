import { ref } from 'vue'
import { defineStore } from 'pinia'

import { userApi, type IBooking } from '@/api/user'
import { settingsApi } from '@/api/settings'

import { DEFAULT_BOOKING_PAYMENT_DELAY_IN_SECONDS } from '@/consts'

export const useUserStore = defineStore('user-store', () => {
  const userBookings = ref<IBooking[]>([])
  const isLoggedIn = ref(!!localStorage.getItem('token') || false)
  const settings = ref<number>(DEFAULT_BOOKING_PAYMENT_DELAY_IN_SECONDS)

  function setToken(token: string): void {
    localStorage.setItem('token', token)
    isLoggedIn.value = true
  }

  function logout(): void {
    localStorage.clear()
    isLoggedIn.value = false
  }

  async function fetchSettings() {
    try {
      const response = await settingsApi.getSettings()

      settings.value = response.bookingPaymentTimeSeconds
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  async function fetchUserBookings() {
    try {
      userBookings.value = await userApi.getUserBookings()
    } catch (error) {
      console.error('Error fetching user bookings:', error)
    }
  }

  return {
    isLoggedIn,
    userBookings,
    settings,

    setToken,
    logout,
    fetchSettings,
    fetchUserBookings,
  }
})
