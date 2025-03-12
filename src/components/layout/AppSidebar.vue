<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && setIsHovered(true)"
    @mouseleave="setIsHovered(false)"
  >
    <div
      :class="[
        'py-8 flex',
        !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
      ]"
    >
      <router-link to="/">
        <span class="text-xl font-bold">Admin Panel</span>
      </router-link>
    </div>
    <div class="flex flex-col overflow-y-auto duration-300 ease-linear">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <ul class="flex flex-col gap-4">
            <li>
              <router-link
                to="/admin/apartments"
                class="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100"
                :class="{ 'bg-gray-100': route.path.startsWith('/admin/apartments') }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span v-if="isExpanded || isHovered || isMobileOpen">Apartments</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { useSidebar } from '../../composables/useSidebar'

const route = useRoute()
const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar()
</script>

<style scoped>
.router-link-active {
  @apply bg-gray-100 text-gray-900;
}
</style>
