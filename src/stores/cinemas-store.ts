import { ref } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'

import { type ICinema, type ICinemaSession, cinemasApi } from '@/api/cinemas'

export const useCinemasStore = defineStore('cinemas-store', () => {
  const cinemas = ref<ICinema[]>([])
  const cinemaSessions = ref<ICinemaSession[]>([])

  const getCinemaById = (id: number): ICinema | null => {
    return cinemas.value.find((cinema) => cinema.id === id) || null
  }

  const getMappedCinemaSessions = (sessions: ICinemaSession[]) => {
    const mappedSessions = new Map<string, Map<number, ICinemaSession[]>>()

    sessions.forEach((session) => {
      const date = dayjs(session.startTime).format('DD.MM')

      if (mappedSessions.has(date)) {
        const existingSessions = mappedSessions.get(date) || new Map<number, ICinemaSession[]>()
        const existingMovieSessions = existingSessions.get(session.movieId) || []

        existingMovieSessions.push(session)
        existingSessions.set(session.movieId, existingMovieSessions)
        mappedSessions.set(date, existingSessions)
      } else {
        mappedSessions.set(
          date,
          new Map<number, ICinemaSession[]>().set(session.movieId, [session]),
        )
      }
    })

    return mappedSessions
  }

  async function fetchCinemas() {
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
    getMappedCinemaSessions,

    fetchCinemas,
    fetchCinemaSessions,
  }
})
