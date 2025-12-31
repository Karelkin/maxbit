<script setup lang="ts">
import { useRouter } from 'vue-router'

import type { ICinema } from '@/api/cinemas'

const router = useRouter()

defineProps<{
  cinema: ICinema
}>()

function redirectToCinema(cinemaId: number) {
  router.push({ name: 'cinema', params: { cinemaId } })
}
</script>

<template>
  <article class="cinema-item cinema-item-container">
    <p class="cinema-item__duration">{{ cinema.name }} мин.</p>
    <p class="cinema-item__rating">{{ cinema.address }}</p>
    <button class="cinema-item__actions button-default" @click="redirectToCinema(cinema.id)">
      Посмотреть сеансы
    </button>
  </article>
</template>

<style lang="scss" scoped>
.cinema-item {
  img {
    &::before {
      font-size: 0.6rem;
      line-height: 0;
    }
  }
}
</style>
