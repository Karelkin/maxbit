<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'

import { useCinemasStore } from '@/stores/cinemas-store'
import { useMovieSessionStore } from '@/stores/movie-session-store'
import { useMoviesStore } from '@/stores/movies-store'
import { movieSessionApi, type ISeatBooking } from '@/api/movie-session'
import { useUserStore } from '@/stores/user-store'

const route = useRoute()
const router = useRouter()

const moviesStore = useMoviesStore()
const cinemaStore = useCinemasStore()
const sessionStore = useMovieSessionStore()
const userStore = useUserStore()

const { movieSessionInfo } = storeToRefs(sessionStore)
const { movies } = storeToRefs(moviesStore)
const { cinemas } = storeToRefs(cinemaStore)
const { isLoggedIn } = storeToRefs(userStore)

const { getMovieById, fetchMovies } = moviesStore
const { getCinemaById, fetchCinemas } = cinemaStore
const { fetchMovieSessionInfo } = sessionStore

const bookings = ref(new Map<string, ISeatBooking>())
const bookedSeats = ref(new Map<string, ISeatBooking>())

function onSelectSeat(rowIdx: number, seatIdx: number) {
  if (!isLoggedIn.value) {
    return
  }

  if (bookings.value.has(`${rowIdx}-${seatIdx}`)) {
    bookings.value.delete(`${rowIdx}-${seatIdx}`)
  } else {
    bookings.value.set(`${rowIdx}-${seatIdx}`, {
      rowNumber: rowIdx,
      seatNumber: seatIdx,
    })
  }
}

async function updateBookedSeats(movieSessionId: number): Promise<void> {
  await fetchMovieSessionInfo(Number(movieSessionId))

  bookings.value.clear()
  bookedSeats.value = new Map(
    movieSessionInfo.value?.bookedSeats.map((seat) => [
      `${seat.rowNumber}-${seat.seatNumber}`,
      {
        rowNumber: seat.rowNumber,
        seatNumber: seat.seatNumber,
      },
    ]),
  )
}

async function bookSeats(movieSessionId: number): Promise<void> {
  if (!isLoggedIn.value) {
    router.push({ name: 'sign-in' })
  }

  if (bookings.value.size === 0) return

  const selectedSeats = Array.from(bookings.value.values())

  await movieSessionApi.createBooking({ id: movieSessionId, seats: selectedSeats })

  router.push({ name: 'tickets' })
}

onMounted(async () => {
  if (movies.value.length === 0) {
    await fetchMovies()
  }

  if (cinemas.value.length === 0) {
    await fetchCinemas()
  }

  updateBookedSeats(Number(route.params.sessionId))
})
</script>

<template>
  <div v-if="movieSessionInfo" class="session">
    <h2>Выбрать места</h2>

    <div class="session__info">
      <p>Фильм: {{ getMovieById(movieSessionInfo.movieId)?.title }}</p>
      <p>Кинотеатр: {{ getCinemaById(movieSessionInfo.cinemaId)?.name }}</p>
      <p>Время: {{ dayjs(movieSessionInfo.startTime).format('DD.MM, HH:mm') }}</p>
    </div>

    <div class="session__hall-wrapper">
      <div
        class="session__hall hall"
        :style="{ 'grid-template-rows': `repeat(${movieSessionInfo.seats.rows}, 1fr)` }"
      >
        <div
          class="hall__row"
          v-for="(row, rowIdx) in movieSessionInfo.seats.rows + 1"
          :key="rowIdx"
        >
          <div
            class="hall__seat"
            v-for="(seat, seatIdx) in movieSessionInfo.seats.seatsPerRow + 1"
            :key="seatIdx"
          >
            <template v-if="rowIdx === 0">
              <span v-if="seatIdx === 0" />
              <p v-else>{{ seatIdx }}</p>
            </template>
            <template v-else>
              <p v-if="seatIdx === 0">ряд {{ rowIdx }}</p>
              <button
                v-else
                class="button-default hall__seat-button"
                :class="{
                  'hall__seat-button_selected': bookings.has(`${rowIdx}-${seatIdx}`),
                  'hall__seat-button_booked': bookedSeats.has(`${rowIdx}-${seatIdx}`),
                }"
                @click="onSelectSeat(rowIdx, seatIdx)"
              ></button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <button class="button-default" @click="bookSeats(movieSessionInfo.id)">Забронировать</button>
  </div>
</template>

<style lang="scss" scoped>
.session {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--main-layout-padding);

  > h2 {
    margin-bottom: 24px;
  }

  &__info {
    width: 100%;
    margin-bottom: 24px;
  }

  &__hall-wrapper {
    display: flex;
    max-width: calc(var(--main-layout-content-width) - 64px);
    overflow: auto;
    width: 100%;
  }

  .hall {
    display: grid;
    justify-content: center;
    row-gap: 8px;
    margin-bottom: 32px;

    &__row {
      display: flex;
      gap: 8px;
    }

    &__seat {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;

      &:first-child {
        width: 60px;
      }

      > p {
        white-space: nowrap;
      }

      > button {
        width: 100%;
        height: 100%;
      }
    }

    &__seat-button {
      &_selected {
        background-color: var(--main-blue);
      }

      &_booked {
        background-color: var(--main-red);
      }
    }
  }
}
</style>
