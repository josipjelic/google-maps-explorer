<script setup lang="ts">
import { computed } from 'vue'
import type { Apartment } from '../types/apartment'
import type { Place } from '../types/place'
import SearchBar from './SearchBar.vue'

const props = defineProps<{
  apartments: Apartment[]
  places: Place[]
  selectedId?: string
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'search', results: { apartments: string[], places: string[] }): void
}>()

const items = computed(() => [
  ...props.apartments.map(apt => ({
    id: apt.id,
    title: apt.title,
    subtitle: `$${apt.price.toLocaleString()}`,
    type: 'apartment',
    rating: null,
    data: apt
  })),
  ...props.places.map(place => ({
    id: place.id.toString(),
    title: place.name,
    subtitle: place.address,
    type: 'place',
    rating: place.rating,
    data: place
  }))
])

function handleSearch(results: { apartments: string[], places: string[] }) {
  emit('search', results)
}
</script>

<template>
  <div class="list-container">
    <div class="list-header">
      <h2>Locations</h2>
      <div class="stats">
        {{ apartments.length }} Apartments • {{ places.length }} Places
      </div>
      <SearchBar @search="handleSearch" />
    </div>
    
    <div class="items-container">
      <div
        v-for="item in items"
        :key="item.id"
        class="list-item"
        :class="{ selected: item.id === selectedId }"
        @click="emit('select', item.id)"
      >
        <div class="item-type" :class="item.type">
          {{ item.type }}
        </div>
        <div class="item-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.subtitle }}</p>
          <div v-if="item.rating" class="rating">
            ★ {{ item.rating.toFixed(1) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.list-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
  color: white;
}

.list-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: white;
}

.stats {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin: 0.5rem 0 1rem;
}

.items-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.list-item {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background: white;
}

.list-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.list-item.selected {
  border-color: #646cff;
  background: rgba(100, 108, 255, 0.05);
}

.item-type {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.item-type.apartment {
  background: rgba(100, 108, 255, 0.1);
  color: #646cff;
}

.item-type.place {
  background: rgba(255, 70, 70, 0.1);
  color: #ff4646;
}

.item-content h3 {
  margin: 0;
  color: #333;
  font-size: 1rem;
}

.item-content p {
  margin: 0.25rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

.rating {
  margin-top: 0.5rem;
  color: #f0b000;
  font-weight: 500;
}
</style>