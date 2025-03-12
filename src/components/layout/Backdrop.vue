<template>
  <div
    v-show="isMobileOpen"
    class="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 lg:hidden"
    @click="toggleMobileSidebar"
  />
</template>

<script setup lang="ts">
import { useSidebar } from '../../composables/useSidebar'

const { isMobileOpen, toggleMobileSidebar } = useSidebar()
</script>
