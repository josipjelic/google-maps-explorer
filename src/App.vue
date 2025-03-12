<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useSidebarProvider } from './composables/useSidebar'

useSidebarProvider()
</script>

<template>
  <div id="app" class="app-container">
    <Suspense>
      <template #default>
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </template>
      <template #fallback>
        <div class="loading-overlay">
          <div class="loading-content">
            <span class="loading-spinner"></span>
            Loading...
          </div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100vh;
}

.app-container {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1000;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.25rem;
  color: #646cff;
}

.loading-spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid #646cff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>