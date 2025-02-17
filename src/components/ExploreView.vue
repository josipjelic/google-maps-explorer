<script setup lang="ts">
import { ref, onMounted, computed, defineAsyncComponent, nextTick } from 'vue'
import { supabase } from '../lib/supabase'
import type { Apartment } from '../types/apartment'
import type { Place } from '../types/place'

// Define LoadingComponent first
const LoadingComponent = {
  template: `
    <div class="loading-overlay">
      <div class="loading-content">
        <span class="loading-spinner"></span>
        Loading map...
      </div>
    </div>
  `
}

// Then use it in the async component definition
const MapView = defineAsyncComponent({
  loader: () => import('./MapView.vue'),
  loadingComponent: LoadingComponent,
  delay: 200,
  timeout: 10000,
  onError(error, retry, fail) {
    console.error('Error loading MapView:', error)
    fail()
  }
})

const ListView = defineAsyncComponent(() => import('./ListView.vue'))
const NavigationBar = defineAsyncComponent(() => import('./NavigationBar.vue'))

const apartments = ref<Apartment[]>([])
const places = ref<Place[]>([])
const selectedId = ref<string>()
const loading = ref(true)
const error = ref<string | null>(null)
const currentBounds = ref<google.maps.LatLngBounds | null>(null)
const filteredIds = ref<{ apartments: string[], places: string[] } | null>(null)
const mapMounted = ref(false)
const shouldRecenter = ref(false)

const visibleApartments = computed(() => {
  let filtered = apartments.value
  
  // Apply search filters if they exist
  if (filteredIds.value?.apartments) {
    filtered = filtered.filter(apt => 
      filteredIds.value!.apartments.includes(apt.id)
    )
  }
  
  // Apply map bounds filter
  if (currentBounds.value) {
    filtered = filtered.filter(apt => 
      isInBounds(apt.latitude, apt.longitude)
    )
  }
  
  return filtered
})

const visiblePlaces = computed(() => {
  let filtered = places.value
  
  // Apply search filters if they exist
  if (filteredIds.value?.places) {
    filtered = filtered.filter(place => 
      filteredIds.value!.places.includes(place.id.toString())
    )
  }
  
  // Apply map bounds filter
  if (currentBounds.value) {
    filtered = filtered.filter(place => 
      isInBounds(Number(place.latitude), Number(place.longitude))
    )
  }
  
  return filtered
})

function isInBounds(lat: number, lng: number) {
  if (!currentBounds.value) return true
  return currentBounds.value.contains({ lat, lng })
}

async function fetchData() {
  try {
    loading.value = true
    error.value = null

    const [apartmentsResponse, placesResponse] = await Promise.all([
      supabase.from('apartments').select('*'),
      supabase.from('places').select('*')
    ])

    if (apartmentsResponse.error) throw apartmentsResponse.error
    if (placesResponse.error) throw placesResponse.error

    apartments.value = apartmentsResponse.data as Apartment[]
    places.value = placesResponse.data as Place[]
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function handleSelect(id: string) {
  selectedId.value = id
}

function handleBoundsChanged(bounds: google.maps.LatLngBounds) {
  currentBounds.value = bounds
}

function handleSearch(results: { apartments: string[], places: string[] }) {
  filteredIds.value = results
  shouldRecenter.value = true
  // Reset shouldRecenter after a short delay
  setTimeout(() => {
    shouldRecenter.value = false
  }, 100)
}

onMounted(async () => {
  await fetchData()
  await nextTick()
  mapMounted.value = true
})
</script>

<template>
  <div class="explore-container">
    <Suspense>
      <template #default>
        <div class="explore-content">
          <NavigationBar />
          <div class="content-wrapper">
            <div v-if="loading" class="loading-overlay">
              <div class="loading-content">
                <span class="loading-spinner"></span>
                Loading...
              </div>
            </div>
            <div v-else-if="error" class="error-overlay">
              {{ error }}
            </div>
            <div v-else class="content-grid">
              <div class="list-pane">
                <ListView
                  :apartments="visibleApartments"
                  :places="visiblePlaces"
                  :selected-id="selectedId"
                  @select="handleSelect"
                  @search="handleSearch"
                />
              </div>
              <div class="map-pane">
                <template v-if="mapMounted">
                  <Suspense>
                    <template #default>
                      <MapView
                        :apartments="visibleApartments"
                        :places="visiblePlaces"
                        :selected-id="selectedId"
                        :should-recenter="shouldRecenter"
                        @select="handleSelect"
                        @bounds-changed="handleBoundsChanged"
                      />
                    </template>
                    <template #fallback>
                      <div class="loading-overlay">
                        <div class="loading-content">
                          <span class="loading-spinner"></span>
                          Loading map...
                        </div>
                      </div>
                    </template>
                  </Suspense>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #fallback>
        <div class="loading-overlay">
          <div class="loading-content">
            <span class="loading-spinner"></span>
            Loading application...
          </div>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
.explore-container {
  width: 100%;
  height: 100vh;
}

.explore-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  position: relative;
  height: calc(100vh - 64px);
  margin-top: 64px;
}

.content-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  height: 100%;
}

.map-pane,
.list-pane {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.list-pane {
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.loading-overlay,
.error-overlay {
  position: absolute;
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

.error-overlay {
  color: #ff4646;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .list-pane {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .list-pane.active {
    transform: translateX(0);
  }
}
</style>