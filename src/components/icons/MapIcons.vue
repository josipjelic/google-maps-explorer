<script setup lang="ts">
type IconType = 'apartment' | 'bar' | 'restaurant' | 'cluster'

defineProps<{
  type: IconType
  count?: number
}>()
</script>

<template>
  <svg v-if="type === 'apartment'" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M17,11V3H7v4H3v14h8v-4h2v4h8V11H17z M7,19H5v-2h2V19z M7,15H5v-2h2V15z M7,11H5V9h2V11z M11,15H9v-2h2V15z M11,11H9V9h2 V11z M11,7H9V5h2V7z M15,15h-2v-2h2V15z M15,11h-2V9h2V11z M15,7h-2V5h2V7z M19,19h-2v-2h2V19z M19,15h-2v-2h2V15z"/>
  </svg>

  <svg v-else-if="type === 'bar'" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M21,5V3H3v2l8,9v5H6v2h12v-2h-5v-5L21,5z M5.23,5h13.54l-1.81,2H7.04L5.23,5z"/>
  </svg>

  <svg v-else-if="type === 'restaurant'" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M8.1,13.34l2.83-2.83L3.91,3.5c-1.56,1.56-1.56,4.09,0,5.66l4.19,4.18z M14.88,11.53c1.53,0.71,3.68,0.21,5.27-1.38 c1.91-1.91,2.28-4.65,0.81-6.12c-1.46-1.46-4.2-1.1-6.12,0.81c-1.59,1.59-2.09,3.74-1.38,5.27L3.7,19.87l1.41,1.41L12,14.41l6.88,6.88 l1.41-1.41L13.41,13L14.88,11.53z"/>
  </svg>

  <svg v-else-if="type === 'cluster'" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="currentColor"/>
    <text
      x="12"
      y="12"
      dominant-baseline="middle"
      text-anchor="middle"
      fill="white"
      font-size="10"
      font-weight="bold"
    >{{ count }}</text>
  </svg>
</template>