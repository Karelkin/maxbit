<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import dayjs from 'dayjs'

import { type ISessionFullInfo } from '@/services/movie-session-service'
import { bookingApi } from '@/api/booking'
import { useUserService } from '@/services/user-service'

const props = defineProps<{ booking: ISessionFullInfo }>()
const emit = defineEmits<{ 'update-tickets': [] }>()

const { settings } = useUserService()

const timeLeft = ref(0)
const timerId = ref<number | null>(null)

const formattedTime = computed(() => {
  const minutes = Math.floor((timeLeft.value % 3600) / 60)
  const seconds = timeLeft.value % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

async function onPay(): Promise<void> {
  await bookingApi.createPayment(props.booking.booking.id)
  emit('update-tickets')
}

function startTimer() {
  timerId.value = setInterval(() => {
    timeLeft.value -= 1

    if (timeLeft.value === 0 && timerId.value) {
      clearInterval(timerId.value)
      emit('update-tickets')
    }
  }, 1000)
}

onMounted(() => {
  timeLeft.value = settings.value - dayjs(new Date()).diff(props.booking.booking.bookedAt, 'second')

  if (timeLeft.value > 0 && timeLeft.value <= settings.value) {
    startTimer()
  }
})

onUnmounted(() => {
  if (timerId.value) {
    clearInterval(timerId.value)
  }
})
</script>

<template>
  <article class="tickets-item">
    <div class="tickets-item__movie-info">
      <p>{{ booking?.movie?.title }}</p>
      <p>{{ booking?.cinema?.name }}</p>
      <p>{{ dayjs(booking?.movieSessionInfo?.startTime).format('DD.MM HH:mm') }}</p>
    </div>

    <div class="tickets-item__seats-info">
      <p v-for="(seat, idx) in booking?.movieSessionInfo?.bookedSeats" :key="idx">
        Ряд {{ seat.rowNumber }}, место {{ seat.seatNumber }}
      </p>
    </div>

    <template v-if="!booking.booking.isPaid">
      <button class="button-default" @click="onPay">Оплатить</button>

      <p v-if="timerId" class="tickets-item__time">Осталось {{ formattedTime }}</p>
    </template>
  </article>
</template>

<style lang="scss" scoped>
.tickets-item {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: flex-start;
  gap: 32px;

  &__movie-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__seats-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
