<script setup lang="ts">
import { computed } from 'vue'
import type { Apartment } from '../types/apartment'
import type { Place } from '../types/place'

const props = defineProps<{
  item: Apartment | Place | null
  type: 'apartment' | 'place' | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const title = computed(() => {
  if (!props.item) return ''
  return 'title' in props.item ? props.item.title : props.item.name
})

const formattedPrice = computed(() => {
  if (!props.item || !('price' in props.item)) return null
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(props.item.price)
})

const formattedRating = computed(() => {
  if (!props.item || !('rating' in props.item) || !props.item.rating) return null
  return props.item.rating.toFixed(1)
})

const openingHours = computed(() => {
  if (!props.item || !('opening_hours' in props.item) || !props.item.opening_hours) return null
  return props.item.opening_hours.weekday_text
})
</script>

<template>
  <div v-if="item" class="info-pane">
    <button class="close-button" @click="emit('close')">×</button>
    
    <div class="info-content">
      <div class="info-header">
        <div class="type-badge" :class="type">
          {{ type }}
        </div>
        <h2>{{ title }}</h2>
      </div>

      <div class="info-details">
        <!-- Apartment specific details -->
        <template v-if="type === 'apartment'">
          <div v-if="formattedPrice" class="detail-item price">
            <strong>{{ formattedPrice }}</strong>
          </div>
          
          <div v-if="'bedrooms' in item" class="detail-item">
            <strong>{{ item.bedrooms }}</strong> bedrooms
          </div>
          
          <div v-if="'bathrooms' in item" class="detail-item">
            <strong>{{ item.bathrooms }}</strong> bathrooms
          </div>
          
          <div v-if="'area' in item" class="detail-item">
            <strong>{{ item.area }}</strong> m²
          </div>
        </template>

        <!-- Place specific details -->
        <template v-else-if="type === 'place'">
          <div v-if="formattedRating" class="detail-item rating">
            <span class="stars">★</span>
            <strong>{{ formattedRating }}</strong>
            <span v-if="'review_count' in item && item.review_count">
              ({{ item.review_count }} reviews)
            </span>
          </div>
          
          <div v-if="'phone' in item && item.phone" class="detail-item">
            📞 {{ item.phone }}
          </div>
          
          <div v-if="'website' in item && item.website" class="detail-item">
            <a :href="item.website" target="_blank" rel="noopener noreferrer">
              Visit Website
            </a>
          </div>
        </template>

        <!-- Common details -->
        <div class="detail-item address">
          📍 {{ 'address' in item ? item.address : '' }}
        </div>

        <!-- Opening hours for places -->
        <div v-if="openingHours" class="opening-hours">
          <h3>Opening Hours</h3>
          <ul>
            <li v-for="hours in openingHours" :key="hours">
              {{ hours }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-pane {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 360px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.close-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  color: #666;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.info-content {
  padding: 1.5rem;
}

.info-header {
  margin-bottom: 1rem;
}

.type-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  margin-bottom: 0.5rem;
}

.type-badge.apartment {
  background: rgba(100, 108, 255, 0.1);
  color: #646cff;
}

.type-badge.place {
  background: rgba(255, 70, 70, 0.1);
  color: #ff4646;
}

h2 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
  line-height: 1.4;
}

.info-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  color: #666;
  font-size: 0.875rem;
}

.detail-item strong {
  color: #333;
  font-weight: 600;
}

.detail-item.price {
  font-size: 1.25rem;
  color: #646cff;
}

.detail-item.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.stars {
  color: #f0b000;
}

.opening-hours {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
}

.opening-hours h3 {
  font-size: 0.875rem;
  color: #333;
  margin: 0 0 0.5rem;
}

.opening-hours ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
  color: #666;
}

.opening-hours li {
  padding: 0.25rem 0;
}

a {
  color: #646cff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>