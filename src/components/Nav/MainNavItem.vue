<script lang="ts" setup>
import type { INavItem } from '@/consts'

defineProps<{
  item: INavItem
}>()
</script>

<template>
  <li class="nav-item">
    <router-link class="nav-item__link" :to="item.path" active-class="nav-item__link_active">{{
      item.title
    }}</router-link>
  </li>
</template>

<style lang="scss" scoped>
.nav-item {
  &__link {
    display: block;
    padding: 12px 24px;
    text-decoration: none;
    border-top: 1px solid var(--main-black);
    border-bottom: 1px solid var(--main-black);

    &_active {
      background-color: rgba(255, 255, 255, 0.2);
      border-top: 1px solid var(--main-white);
      border-bottom: 1px solid var(--main-white);
    }
  }
}
</style>
