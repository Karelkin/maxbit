<script setup lang="ts">
import { onMounted, ref } from 'vue'

import {
  BookingType,
  useMovieSessionService,
  type ISessionFullInfo,
} from '@/services/movie-session-service'
import { useUserService } from '@/services/user-service'

import TicketsItem from '@/components/tickets/TicketsItem.vue'

const { getMovieSessionInfoById, getMappedUserBookings } = useMovieSessionService()
const { userBookings, fetchSettings, fetchUserBookings } = useUserService()

const isLoading = ref(true)
const mappedBookings = ref<Map<BookingType, ISessionFullInfo[]>>(new Map())

async function updateBookings() {
  isLoading.value = true

  await fetchUserBookings()

  const promises: Promise<ISessionFullInfo>[] = userBookings.value.map((booking) =>
    getMovieSessionInfoById(booking),
  )

  Promise.all(promises)
    .then((response) => {
      mappedBookings.value = getMappedUserBookings(response)
    })
    .finally(() => {
      isLoading.value = false
    })
}

onMounted(async () => {
  await fetchSettings()
  await updateBookings()
})
</script>

<template>
  <div class="tickets">
    <h2>Мои билеты</h2>

    <template v-if="isLoading">
      <p>Loading...</p>
    </template>
    <template v-else>
      <section class="tickets__section" v-for="bookingType in mappedBookings" :key="bookingType[0]">
        <p>{{ bookingType[0] }}</p>
        <span class="divider" />
        <template v-if="bookingType[1].length > 0">
          <div class="tickets__list">
            <TicketsItem
              v-for="booking in bookingType[1]"
              :key="booking.booking.id"
              :booking="booking"
              @update-tickets="updateBookings"
            />
          </div>
        </template>
        <template v-else>
          <p>...</p>
        </template>
      </section>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.tickets {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--main-layout-padding);
  gap: 32px;

  &__section {
    width: 100%;

    > p {
      font-size: 1.2rem;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
}
</style>
