<script lang="ts" setup>
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

import type { ICinemaSession } from '@/api/cinemas'
import { useMoviesService } from '@/services/movies-service'

const router = useRouter()

const { getMovieById } = useMoviesService()

defineProps<{
  time: string
  sessions: Map<number, ICinemaSession[]>
}>()

function redirectToSession(cinemaId: number, sessionId: number) {
  router.push({
    name: 'cinema-session',
    params: { cinemaId, sessionId },
  })
}
</script>

<template>
  <article class="cinema-session-item">
    <div class="cinema-session-item__time">
      <h5>{{ time }}</h5>
    </div>

    <div class="cinema-session-item__movies">
      <div
        class="cinema-session-item__movie"
        v-for="movieSession in sessions"
        :key="movieSession[0]"
      >
        <img
          :src="getMovieById(movieSession[0])?.posterImage"
          :alt="getMovieById(movieSession[0])?.title"
        />
        <p>{{ getMovieById(movieSession[0])?.title }}</p>

        <div class="cinema-session-item__sessions-wrapper">
          <div
            class="cinema-session-item__sessions"
            v-for="session in movieSession[1]"
            :key="session.id"
          >
            <button class="button-default" @click="redirectToSession(session.cinemaId, session.id)">
              {{ dayjs(session.startTime).format('HH:mm') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.cinema-session-item {
  &__time {
    border-bottom: 1px solid var(--main-white);
    padding-bottom: 8px;
    margin-bottom: 16px;
  }

  &__movies {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__movie {
    display: grid;
    grid-template-columns: 60px 250px 1fr;
    align-items: center;
    gap: 24px;

    > img {
      &::before {
        font-size: 0.6rem;
      }
    }
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
