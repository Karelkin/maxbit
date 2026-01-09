import { storeToRefs } from 'pinia'

import { useUserStore } from '@/stores/user-store'

export const useUserService = () => {
  const userStore = useUserStore()

  const { isLoggedIn, userBookings, settings } = storeToRefs(userStore)
  const { setToken, logout, fetchSettings, fetchUserBookings } = userStore

  return {
    isLoggedIn,
    userBookings,
    settings,

    setToken,
    logout,
    fetchSettings,
    fetchUserBookings,
  }
}
