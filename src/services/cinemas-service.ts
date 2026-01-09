import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'

import type { ICinema, ICinemaSession } from '@/api/cinemas'
import { useCinemasStore } from '@/stores/cinemas-store'

export interface ICinemaWithSessions extends ICinema {
  sessions: ICinemaSession[]
}

export const useCinemasService = () => {
  const cinemasStore = useCinemasStore()

  const { cinemas, cinemaSessions } = storeToRefs(cinemasStore)
  const { getCinemaById, fetchCinemas, fetchCinemaSessions } = cinemasStore

  return {
    cinemas,
    cinemaSessions,

    getCinemaById,

    getMappedCinemaSessions: (
      sessions: ICinemaSession[],
    ): Map<string, Map<number, ICinemaSession[]>> => {
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
    },

    fetchCinemaWithSessions: async (cinemaId: number): Promise<void> => {
      if (cinemas.value.length === 0) {
        await fetchCinemas()
      }

      const cinema = getCinemaById(cinemaId)

      if (!cinema) {
        return
      }

      if (cinemaSessions.value.length === 0 || cinemaSessions.value[0]?.cinemaId !== cinemaId) {
        await fetchCinemaSessions(cinemaId)
      }
    },

    fetchCinemas,
    fetchCinemaSessions,
  }
}
