<script setup lang="ts">
import { useRouter } from 'vue-router'

import type { IMovie } from '@/api/movies'

const router = useRouter()

defineProps<{
  movie: IMovie
}>()

function redirectToMovie(movieId: number) {
  router.push({ name: 'movie', params: { movieId } })
}
</script>

<template>
  <article class="movie-item movie-item-container">
    <img :src="movie.posterImage" :alt="movie.title" />
    <h5 class="movie-item__title">{{ movie.title }}</h5>
    <p class="movie-item__duration">{{ movie.lengthMinutes }} мин.</p>
    <p class="movie-item__rating">{{ movie.rating }}</p>
    <button class="movie-item__actions button-default" @click="redirectToMovie(movie.id)">
      Посмотреть сеансы
    </button>
  </article>
</template>

<style lang="scss" scoped>
.movie-item {
  img {
    &::before {
      font-size: 0.6rem;
      line-height: 0;
    }
  }
}
</style>
