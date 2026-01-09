<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useMoviesService } from '@/services/movies-service'

import MovieSessionItem from '@/components/movies/MovieSessionItem.vue'
import { useCinemasService } from '@/services/cinemas-service'

const route = useRoute()
const router = useRouter()

const { movieSessions, getMovieById, fetchMovieWithSessions, getMappedMovieSessions } =
  useMoviesService()
const { cinemas, fetchCinemas } = useCinemasService()

const movie = computed(() => getMovieById(Number(route.params.movieId)))

onMounted(async () => {
  await fetchMovieWithSessions(Number(route.params.movieId))

  if (movie.value === null || movieSessions.value.length === 0) {
    router.replace('/')
  }

  if (cinemas.value.length === 0) {
    fetchCinemas()
  }
})
</script>

<template>
  <div v-if="movie" class="movie">
    <section class="movie__wrapper">
      <h2>{{ movie.title }}</h2>

      <div class="movie__info info">
        <img :src="movie.posterImage" :alt="movie.title" />
        <div class="info__description">
          <p>{{ movie.description }}</p>

          <p>Год: {{ movie.year }}</p>
          <p>Продолжительность: {{ movie.lengthMinutes }}</p>
          <p>Рейтинг: {{ movie.rating }}</p>
        </div>
      </div>
    </section>

    <section class="movie__sessions">
      <MovieSessionItem
        v-for="session in getMappedMovieSessions(movieSessions)"
        :key="session[0]"
        :time="session[0]"
        :sessions="session[1]"
      />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.movie {
  padding: var(--main-layout-padding);

  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px;

    > h2 {
      margin-bottom: 24px;
    }
  }

  .info {
    display: flex;
    gap: 24px;

    &__description {
      p:first-child {
        margin-bottom: 16px;
      }
    }
  }

  &__sessions {
    display: flex;
    flex-direction: column;
    gap: 48px;
  }
}
</style>
