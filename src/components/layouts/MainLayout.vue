<script lang="ts" setup>
import MainNav from '@/components/Nav/MainNav.vue'
</script>

<template>
  <main class="main-layout">
    <header>
      <h1>{{ $route.meta.title }}</h1>
    </header>

    <div class="main-layout__wrapper">
      <MainNav />
      <div class="main-layout__content">
        <router-view />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.main-layout {
  &__wrapper {
    display: grid;
    grid-template-columns: var(--main-layout-nav-width) var(--main-layout-content-width);
    border: 1px solid var(--main-white);
    min-height: var(--main-layout-content-height);
  }
}
</style>
