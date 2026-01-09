<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { authApi } from '@/api/auth'
import { useUserService } from '@/services/user-service'

import MainInput from '@/components/MainInput.vue'

const router = useRouter()

const { setToken } = useUserService()

const username = ref('')
const password = ref('')
const passwordConfirm = ref('')
const formErrors = reactive({
  username: '',
  password: '',
  passwordConfirm: '',
})

watch([username, password, passwordConfirm], () => {
  validateForm()
})

const isValidForm = computed(() => {
  return !formErrors.username && !formErrors.password && !formErrors.passwordConfirm
})

function validateUsername() {
  formErrors.username =
    username.value.trim().length < 8 && username.value.trim().length > 0 ? 'Минимум 8 символов' : ''
}

function validatePassword() {
  if (
    (password.value.length < 8 && password.value.length > 0) ||
    !/[a-z]/.test(password.value) ||
    !/[A-Z]/.test(password.value) ||
    !/[0-9]/.test(password.value)
  ) {
    formErrors.password = 'Минимум 8 символов, минимум 1 заглавная буква и 1 цифра'
  } else {
    formErrors.password = ''
  }
}

function validatePasswordConfirm() {
  if (password.value && passwordConfirm.value && password.value !== passwordConfirm.value) {
    formErrors.passwordConfirm = 'Пароли не совпадают'
  } else {
    formErrors.passwordConfirm = ''
  }
}

function validateForm() {
  validateUsername()
  validatePassword()
  validatePasswordConfirm()
}

async function handleSubmit() {
  if (!isValidForm.value) return

  try {
    const response = await authApi.register({ username: username.value, password: password.value })
    setToken(response.token)
    router.push({ name: 'movies' })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="sign-up">
    <h2>{{ $route.meta.title }}</h2>

    <form @submit.prevent="handleSubmit">
      <MainInput
        v-model="username"
        id="username"
        label="Логин"
        type="text"
        :error="formErrors.username"
        required
      />

      <MainInput
        v-model="password"
        id="password"
        label="Пароль"
        type="password"
        :error="formErrors.password"
        required
      />

      <MainInput
        v-model="passwordConfirm"
        id="password-confirm"
        label="Подтверждение пароля"
        type="password"
        :error="formErrors.passwordConfirm"
        required
      />

      <button class="button-default" type="submit">Зарегистрироваться</button>
    </form>

    <p>Если вы уже зарегистрированы, <router-link to="/sign-in">войдите</router-link></p>
  </div>
</template>

<style lang="scss" scoped>
.sign-up {
  padding: var(--main-layout-padding);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
  }
}
</style>
