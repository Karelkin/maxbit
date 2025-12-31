import api from './index'

export interface IMovie {
  id: number
  title: string
  description: string
  year: number
  lengthMinutes: number
  posterImage: string
  rating: number
}

export interface IMovieSession {
  id: number
  movieId: number
  cinemaId: number
  startTime: string
}

export const moviesApi = {
  getMovies: async (): Promise<IMovie[]> => {
    return await api.get('/movies')
  },

  getMovieSessionsById: async (id: number): Promise<IMovieSession[]> => {
    return await api.get(`/movies/${id}/sessions`)
  },
}
