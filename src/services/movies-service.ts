import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'

import type { IMovie, IMovieSession } from '@/api/movies'
import { useMoviesStore } from '@/stores/movies-store'

export interface IMovieWithSessions extends IMovie {
  sessions: IMovieSession[]
}

export const useMoviesService = () => {
  const moviesStore = useMoviesStore()

  const { movies, movieSessions } = storeToRefs(moviesStore)
  const { getMovieById, fetchMovies, fetchMovieSessions } = moviesStore

  return {
    movies,
    movieSessions,

    getMovieById,

    getMappedMovieSessions: (
      sessions: IMovieSession[],
    ): Map<string, Map<number, IMovieSession[]>> => {
      const mappedSessions = new Map<string, Map<number, IMovieSession[]>>()

      sessions.forEach((session) => {
        const date = dayjs(session.startTime).format('DD.MM')

        if (mappedSessions.has(date)) {
          const existingSessions = mappedSessions.get(date) || new Map<number, IMovieSession[]>()
          const existingCinemaSessions = existingSessions.get(session.cinemaId) || []

          existingCinemaSessions.push(session)
          existingSessions.set(session.cinemaId, existingCinemaSessions)
          mappedSessions.set(date, existingSessions)
        } else {
          mappedSessions.set(
            date,
            new Map<number, IMovieSession[]>().set(session.cinemaId, [session]),
          )
        }
      })

      return mappedSessions
    },

    fetchMovieWithSessions: async (movieId: number): Promise<void> => {
      if (movies.value.length === 0) {
        await fetchMovies()
      }

      const movie = getMovieById(movieId)

      if (!movie) {
        return
      }

      if (movieSessions.value.length === 0 || movieSessions.value[0]?.movieId !== movieId) {
        await fetchMovieSessions(movieId)
      }
    },

    fetchMovies,
    fetchMovieSessions,
  }
}
