import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'

import type { ICinema } from '@/api/cinemas'
import type { IMovie } from '@/api/movies'
import type { IBooking } from '@/api/user'
import { movieSessionApi, type IMovieSessionInfo } from '@/api/movie-session'
import { useCinemasStore } from '@/stores/cinemas-store'
import { useMoviesStore } from '@/stores/movies-store'

export interface ISessionFullInfo {
  booking: IBooking
  movieSessionInfo: IMovieSessionInfo | null
  movie: IMovie | null
  cinema: ICinema | null
}

export const BookingType = {
  Waiting: 'Не оплаченные',
  Confirmed: 'Будущие',
  Completed: 'Прошедшие',
} as const

export type BookingType = (typeof BookingType)[keyof typeof BookingType]

const movieStore = useMoviesStore()
const cinemasStore = useCinemasStore()

const { movies } = storeToRefs(movieStore)
const { cinemas } = storeToRefs(cinemasStore)

const { getCinemaById, fetchCinemas } = cinemasStore
const { getMovieById, fetchMovies } = movieStore

export const movieSessionService = {
  getMappedUserBookings: (sessionsInfo: ISessionFullInfo[]) => {
    const mappedBookings = new Map<BookingType, ISessionFullInfo[]>()

    mappedBookings.set(BookingType.Waiting, [])
    mappedBookings.set(BookingType.Confirmed, [])
    mappedBookings.set(BookingType.Completed, [])

    sessionsInfo.forEach((item) => {
      if (!item.booking.isPaid) {
        mappedBookings.set(BookingType.Waiting, [
          ...(mappedBookings.get(BookingType.Waiting) || []),
          item,
        ])
      }

      if (item.booking.isPaid && dayjs(new Date()).isBefore(item.movieSessionInfo?.startTime)) {
        mappedBookings.set(BookingType.Confirmed, [
          ...(mappedBookings.get(BookingType.Confirmed) || []),
          item,
        ])
      }

      if (item.booking.isPaid && dayjs(new Date()).isAfter(item.movieSessionInfo?.startTime)) {
        mappedBookings.set(BookingType.Completed, [
          ...(mappedBookings.get(BookingType.Completed) || []),
          item,
        ])
      }
    })

    return mappedBookings
  },

  getMovieSessionInfoById: async (booking: IBooking): Promise<ISessionFullInfo> => {
    const movieSessionInfo = await movieSessionApi.getMovieSessionInfoById(booking.movieSessionId)

    if (!movieSessionInfo) {
      throw new Error('Movie session not found')
    }

    if (movies.value.length === 0) {
      await fetchMovies()
    }

    if (cinemas.value.length === 0) {
      await fetchCinemas()
    }

    return {
      booking: booking,
      movieSessionInfo: movieSessionInfo,
      movie: getMovieById(movieSessionInfo.movieId),
      cinema: getCinemaById(movieSessionInfo.cinemaId),
    }
  },
}
