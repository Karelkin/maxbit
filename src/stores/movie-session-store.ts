import { ref } from 'vue'
import { defineStore } from 'pinia'

import { type IMovieSessionInfo, movieSessionApi } from '@/api/movie-session'

export const useMovieSessionStore = defineStore('movie-session-store', () => {
  const movieSessionInfo = ref<IMovieSessionInfo | null>(null)

  async function fetchMovieSessionInfo(id: number) {
    try {
      movieSessionInfo.value = await movieSessionApi.getMovieSessionInfoById(id)
    } catch (error) {
      console.error('Error fetching movie session info:', error)
    }
  }

  return {
    movieSessionInfo,

    fetchMovieSessionInfo,
  }
})
