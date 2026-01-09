<script setup lang="ts">
import { onMounted } from 'vue'

import { useCinemasService } from '@/services/cinemas-service'

import CinemaItem from '@/components/cinemas/CinemaItem.vue'

const { cinemas, fetchCinemas } = useCinemasService()

onMounted(() => {
  fetchCinemas()
})
</script>

<template>
  <div class="cinemas">
    <div class="cinemas__header cinema-item-container">
      <h3>Кинотеатр</h3>
      <h3>Адрес</h3>
      <span />
    </div>
    <section class="cinemas__content">
      <CinemaItem v-for="cinema in cinemas" :key="cinema.id" :cinema="cinema" />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.cinemas {
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
