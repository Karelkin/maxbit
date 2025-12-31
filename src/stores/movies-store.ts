import { ref } from 'vue'
import { defineStore } from 'pinia'
import dayjs from 'dayjs'

import { moviesApi, type IMovie, type IMovieSession } from '@/api/movies'

export const useMoviesStore = defineStore('movies-store', () => {
  const movies = ref<IMovie[]>([])
  const movieSessions = ref<IMovieSession[]>([])

  const getMovieById = (id: number): IMovie | null =>
    movies.value.find((movie) => movie.id === id) || null

  const getMappedMovieSessions = (sessions: IMovieSession[]) => {
    const mappedSessions = new Map<string, Map<number, IMovieSession[]>>()

    sessions.forEach((session) => {
      const date = dayjs(session.startTime).format('DD.MM')

      if (mappedSessions.has(date)) {
        const existingSessions = mappedSessions.get(date) || new Map<number, IMovieSession[]>()
        const existingMovieSessions = existingSessions.get(session.cinemaId) || []

        existingMovieSessions.push(session)
        existingSessions.set(session.cinemaId, existingMovieSessions)
        mappedSessions.set(date, existingSessions)
      } else {
        mappedSessions.set(
          date,
          new Map<number, IMovieSession[]>().set(session.cinemaId, [session]),
        )
      }
    })

    return mappedSessions
  }

  async function fetchMovies() {
    try {
      movies.value = await moviesApi.getMovies()
    } catch (error) {
      console.error('Error fetching movies:', error)
    }
  }

  async function fetchMovieSessions(id: number) {
    try {
      movieSessions.value = await moviesApi.getMovieSessionsById(id)
    } catch (error) {
      console.error('Error fetching movie sessions:', error)
    }
  }

  return {
    movies,
    movieSessions,

    getMovieById,
    getMappedMovieSessions,

    fetchMovies,
    fetchMovieSessions,
  }
})
