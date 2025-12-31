<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useCinemasStore } from '@/stores/cinemas-store'

import CinemaSessionItem from '@/components/cinemas/CinemaSessionItem.vue'

const route = useRoute()
const router = useRouter()

const cinemasStore = useCinemasStore()

const { cinemaSessions } = storeToRefs(cinemasStore)

const { getCinemaById, getMappedCinemaSessions, fetchCinemas, fetchCinemaSessions } = cinemasStore

const cinema = computed(() => getCinemaById(Number(route.params.cinemaId)))

onMounted(async () => {
  if (!cinema.value) {
    await fetchCinemas()

    if (!cinema.value) {
      return router.push('/')
    }
  }

  if (cinema.value) {
    await fetchCinemaSessions(cinema.value.id)
  }
})
</script>

<template>
  <div v-if="cinema" class="movie">
    <section class="movie__wrapper">
      <h2>{{ cinema.name }}</h2>
    </section>

    <section class="movie__sessions">
      <CinemaSessionItem
        v-for="session in getMappedCinemaSessions(cinemaSessions)"
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
