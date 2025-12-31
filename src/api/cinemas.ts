import api from './index'

export interface ICinema {
  id: number
  name: string
  address: string
}

export interface ICinemaSession {
  id: number
  movieId: number
  cinemaId: number
  startTime: string
}

export const cinemasApi = {
  getCinemas: async (): Promise<ICinema[]> => {
    return await api.get('/cinemas')
  },

  getCinemaSessionsById: async (id: number): Promise<ICinemaSession[]> => {
    return await api.get(`/cinemas/${id}/sessions`)
  },
}
