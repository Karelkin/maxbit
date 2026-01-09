import { ref } from 'vue'
import { defineStore } from 'pinia'

import { moviesApi, type IMovie, type IMovieSession } from '@/api/movies'

export const useMoviesStore = defineStore('movies-store', () => {
  const movies = ref<IMovie[]>([])
  const movieSessions = ref<IMovieSession[]>([])

  const getMovieById = (id: number): IMovie | null =>
    movies.value.find((movie: IMovie) => movie.id === id) || null

  async function fetchMovies(): Promise<void> {
    try {
      movies.value = await moviesApi.getMovies()
    } catch (error) {
      console.error('Error fetching movies:', error)
    }
  }

  async function fetchMovieSessions(id: number): Promise<void> {
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

    fetchMovies,
    fetchMovieSessions,
  }
})
