<script setup lang="ts">
import { onMounted } from 'vue'

import { useMoviesService } from '@/services/movies-service'

import MovieItem from '@/components/movies/MovieItem.vue'

const { movies, fetchMovies } = useMoviesService()

onMounted(() => {
  fetchMovies()
})
</script>

<template>
  <div class="home">
    <div class="home__header movie-item-container">
      <span />
      <h3>Название</h3>
      <h3>Продолжительность</h3>
      <h3>Рейтинг</h3>
      <span />
    </div>
    <section class="home__content">
      <MovieItem v-for="movie in movies" :key="movie.id" :movie="movie" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.home {
  padding: var(--main-layout-padding);

  &__header {
    border-bottom: 1px solid var(--main-white);
    padding-bottom: 16px;
    margin-bottom: 16px;

    h3 {
      font-size: 0.8rem;
      font-weight: normal;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
