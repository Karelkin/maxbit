<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMoviesStore } from '@/stores/movies-store'
import { storeToRefs } from 'pinia'

import MovieSessionItem from '@/components/movies/MovieSessionItem.vue'

const route = useRoute()
const router = useRouter()

const moviesStore = useMoviesStore()

const { movieSessions } = storeToRefs(moviesStore)

const { getMovieById, getMappedMovieSessions, fetchMovies, fetchMovieSessions } = moviesStore

const movie = computed(() => getMovieById(Number(route.params.movieId)))

onMounted(async () => {
  if (!movie.value) {
    await fetchMovies()

    if (!movie.value) {
      return router.push('/')
    }
  }

  if (movie.value) {
    await fetchMovieSessions(movie.value.id)
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
