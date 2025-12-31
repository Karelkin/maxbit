<script lang="ts" setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

import type { IMovieSession } from '@/api/movies'
import { useCinemasStore } from '@/stores/cinemas-store'

const router = useRouter()

const cinemasStore = useCinemasStore()

const { cinemas } = storeToRefs(cinemasStore)

const { getCinemaById, fetchCinemas } = cinemasStore

defineProps<{
  time: string
  sessions: Map<number, IMovieSession[]>
}>()

function redirectToSession(movieId: number, sessionId: number) {
  router.push({
    name: 'movie-session',
    params: { movieId, sessionId },
  })
}

onMounted(() => {
  if (cinemas.value.length === 0) {
    fetchCinemas()
  }
})
</script>

<template>
  <article class="movie-session-item">
    <div class="movie-session-item__time">
      <h5>{{ time }}</h5>
    </div>

    <div class="movie-session-item__cinemas">
      <div
        class="movie-session-item__cinema"
        v-for="movieSession in sessions"
        :key="movieSession[0]"
      >
        <p>{{ getCinemaById(movieSession[0])?.name }}</p>

        <div class="movie-session-item__sessions-wrapper">
          <div
            class="movie-session-item__sessions"
            v-for="session in movieSession[1]"
            :key="session.id"
          >
            <button class="button-default" @click="redirectToSession(session.movieId, session.id)">
              {{ dayjs(session.startTime).format('HH:mm') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.movie-session-item {
  &__time {
    border-bottom: 1px solid var(--main-white);
    padding-bottom: 8px;
    margin-bottom: 16px;
  }

  &__cinemas {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__cinema {
    display: grid;
    grid-template-columns: 250px 1fr;
    align-items: center;
    gap: 24px;
  }

  &__sessions-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, 60px);
    gap: 24px;
  }

  &__sessions {
    > button {
      width: 100%;
    }
  }
}
</style>
