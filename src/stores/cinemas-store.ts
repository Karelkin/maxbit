import { ref } from 'vue'
import { defineStore } from 'pinia'

import { type ICinema, type ICinemaSession, cinemasApi } from '@/api/cinemas'

export const useCinemasStore = defineStore('cinemas-store', () => {
  const cinemas = ref<ICinema[]>([])
  const cinemaSessions = ref<ICinemaSession[]>([])

  const getCinemaById = (id: number): ICinema | null => {
    return cinemas.value.find((cinema) => cinema.id === id) || null
  }

  async function fetchCinemas(): Promise<void> {
    try {
      cinemas.value = await cinemasApi.getCinemas()
    } catch (error) {
      console.error('Error fetching cinemas:', error)
    }
  }

  async function fetchCinemaSessions(id: number) {
    try {
      cinemaSessions.value = await cinemasApi.getCinemaSessionsById(id)
    } catch (error) {
      console.error('Error fetching cinema sessions:', error)
    }
  }

  return {
    cinemas,
    cinemaSessions,

    getCinemaById,

    fetchCinemas,
    fetchCinemaSessions,
  }
})
