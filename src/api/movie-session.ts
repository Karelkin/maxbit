import api from './index'

export interface ISeat {
  rows: number
  seatsPerRow: number
}

export interface ISeatBooking {
  rowNumber: number
  seatNumber: number
}

export interface IMovieSessionInfo {
  id: number
  movieId: number
  cinemaId: number
  startTime: string
  seats: ISeat
  bookedSeats: ISeatBooking[]
}

interface ICreateBookingRequest {
  id: number
  seats: ISeatBooking[]
}

interface ICreateBookingResponse {
  bookingId: string
}

export const movieSessionApi = {
  getMovieSessionInfoById: async (id: number): Promise<IMovieSessionInfo> => {
    return await api.get(`/movieSessions/${id}`)
  },

  createBooking: async (params: ICreateBookingRequest): Promise<ICreateBookingResponse> => {
    return await api.post(`/movieSessions/${params.id}/bookings`, {
      seats: params.seats,
    })
  },
}
