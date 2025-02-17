<script setup lang="ts">
import { ref } from 'vue'
import { useSearch } from '../composables/useSearch'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const searchQuery = ref('')
const { search, loading, error } = useSearch()

const emit = defineEmits<{
  (e: 'search', results: { apartments: string[], places: string[] }): void
}>()

async function handleSearch() {
  if (!searchQuery.value.trim()) {
    emit('search', { apartments: [], places: [] })
    return
  }
  
  const results = await search(searchQuery.value)
  if (results) {
    emit('search', results)
  }
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleSearch()
  }
}

function handleClear() {
  searchQuery.value = ''
  emit('search', { apartments: [], places: [] })
}
</script>

<template>
  <div class="search-container">
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Try 'Find apartments near restaurants' or 'Show me places with 2 bedrooms'"
        @keypress="handleKeyPress"
        :disabled="loading"
      />
      <button 
        v-if="searchQuery"
        class="clear-button" 
        @click="handleClear"
        :disabled="loading"
      >
        ×
      </button>
      <button 
        class="search-button" 
        @click="handleSearch"
        :disabled="loading"
      >
        <FontAwesomeIcon 
          :icon="loading ? 'spinner' : 'search'" 
          :class="{ 'fa-spin': loading }"
        />
      </button>
    </div>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <div class="search-examples">
      <span class="examples-label">Try searching for:</span>
      <div class="examples-buttons">
        <button 
          class="example-button" 
          @click="searchQuery = 'Apartments near restaurants'"
        >
          Apartments near restaurants
        </button>
        <button 
          class="example-button" 
          @click="searchQuery = '2 bedroom apartments under $3000'"
        >
          2 bedroom apartments under $3000
        </button>
        <button 
          class="example-button" 
          @click="searchQuery = 'Places close to bars'"
        >
          Places close to bars
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  margin-top: 1rem;
  width: 100%;
}

.search-bar {
  display: flex;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  border: none;
  outline: none;
  background: transparent;
  color: white;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.clear-button {
  background: transparent;
  border: none;
  padding: 0 0.5rem;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.clear-button:hover {
  color: white;
}

.search-button {
  padding: 0 1rem;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.search-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.search-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 87, 87, 0.1);
  border: 1px solid rgba(255, 87, 87, 0.2);
  color: #ff5757;
  border-radius: 8px;
  text-align: center;
  backdrop-filter: blur(20px);
}

.search-examples {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.examples-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
}

.examples-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.example-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(20px);
}

.example-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}
</style>