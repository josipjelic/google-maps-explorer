<template>
  <header
    class="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-gray-900 dark:drop-shadow-none"
  >
    <div class="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
      <div class="flex items-center gap-2 sm:gap-4 lg:hidden">
        <button
          class="z-99999 block rounded-sm border border-gray-200 bg-white p-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:hidden"
          @click="toggleMobileSidebar"
        >
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div class="hidden sm:block">
        <form action="" method="POST">
          <div class="relative">
            <button
              class="absolute left-0 top-1/2 -translate-y-1/2"
              type="button"
            >
              <svg
                class="fill-gray-500 hover:fill-primary dark:fill-gray-400 dark:hover:fill-primary ml-4 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <input
              type="text"
              placeholder="Search..."
              class="w-full bg-transparent pl-11 pr-4 text-gray-500 dark:text-gray-400 rounded-lg border border-gray-200 focus:border-primary dark:border-gray-700 dark:bg-gray-900 focus:outline-none"
            />
          </div>
        </form>
      </div>

      <div class="flex items-center gap-3 2xsm:gap-7">
        <ul class="flex items-center gap-2 2xsm:gap-4">
          <li class="relative">
            <button
              class="flex items-center gap-4 hover:text-primary dark:hover:text-primary"
              @click="toggleSidebar"
            >
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useSidebar } from '../../composables/useSidebar'

const { toggleSidebar, toggleMobileSidebar } = useSidebar()
</script>
