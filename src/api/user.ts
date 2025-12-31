import api from './index'
import type { ISeatBooking } from './movie-session'

export interface IBooking {
  id: number
  userId: number
  movieSessionId: number
  bookedAt: string
  seats: ISeatBooking[]
  isPaid: boolean
}

export const userApi = {
  getUserBookings: async (): Promise<IBooking[]> => {
    return await api.get('/me/bookings')
  },
}
