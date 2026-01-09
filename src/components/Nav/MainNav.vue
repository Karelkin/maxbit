<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useUserService } from '@/services/user-service'
import { NAV_LIST } from '@/consts'

import MainNavItemVue from '@/components/nav/MainNavItem.vue'

const router = useRouter()

const { isLoggedIn, logout } = useUserService()

const filteredNavList = computed(() => {
  if (isLoggedIn.value) {
    return NAV_LIST.filter((item) => item.title !== 'Вход')
  }

  return NAV_LIST
})

function onLogout(): void {
  logout()
  router.push({ name: 'movies' })
}
</script>

<template>
  <nav class="main-navigation">
    <ul>
      <MainNavItemVue v-for="item in filteredNavList" :key="item.title" :item="item" />
      <button v-if="isLoggedIn" class="button-default" @click="onLogout">Выход</button>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.main-navigation {
  ul {
    display: flex;
    flex-direction: column;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid var(--main-white);
    padding: 32px 0;
    min-height: var(--main-nav-height);

    > button {
      margin: auto 16px 0;
    }
  }
}
</style>
