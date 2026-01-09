<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { authApi } from '@/api/auth'
import { useUserService } from '@/services/user-service'

import MainInput from '@/components/MainInput.vue'

const router = useRouter()

const { setToken } = useUserService()

const username = ref('')
const password = ref('')
const error = ref('')

async function handleSubmit() {
  error.value = ''

  try {
    const response = await authApi.login({ username: username.value, password: password.value })
    setToken(response.token)
    router.push({ name: 'movies' })
  } catch {
    error.value = 'Неверный логин или пароль. Проверьте введенные данные и попробуйте снова'
  }
}
</script>

<template>
  <div class="sign-in">
    <h2>{{ $route.meta.title }}</h2>

    <p v-if="error" class="sign-in__error">{{ error }}</p>

    <form @submit.prevent="handleSubmit">
      <MainInput v-model="username" id="username" label="Логин" type="text" required />

      <MainInput v-model="password" id="password-confirm" label="Пароль" type="password" required />

      <button class="button-default" type="submit">Войти</button>
    </form>

    <p>Если у вас нет аккаунта, <router-link to="/sign-up">зарегистрируйтесь</router-link></p>
  </div>
</template>

<style lang="scss" scoped>
.sign-in {
  padding: var(--main-layout-padding);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  &__error {
    color: var(--main-red);
    font-size: 0.8rem;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
  }
}
</style>
