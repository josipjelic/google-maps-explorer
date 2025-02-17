<script setup lang="ts">
import { ref, onMounted, watch, markRaw } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import type { MarkerClusterer } from '@googlemaps/markerclusterer'
import type { Apartment } from '../types/apartment'
import type { Place } from '../types/place'
import { supabase, checkConnection } from '../lib/supabase'
import InfoPane from './InfoPane.vue'

interface PlaceTypeRelation {
  place_id: number
  place_types: {
    name: 'bar' | 'restaurant'
  }
}

interface PlaceTypeResponse {
  place_id: number
  place_types: {
    name: 'bar' | 'restaurant'
  }
}

const props = defineProps<{
  apartments: Apartment[]
  places: Place[]
  selectedId?: string
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'boundsChanged', bounds: google.maps.LatLngBounds): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<google.maps.Map | null>(null)
const markerClusterer = ref<MarkerClusterer | null>(null)
const markers = ref<google.maps.Marker[]>([])
const googleMaps = ref<typeof google.maps | null>(null)
const placeTypeCache = ref(new Map<number, 'bar' | 'restaurant'>())
const selectedItem = ref<Apartment | Place | null>(null)
const selectedType = ref<'apartment' | 'place' | null>(null)
const showInfoPane = ref(false)

// Create marker icons with improved visibility
function createMarkerIcon(type: 'bar' | 'restaurant' | 'apartment') {
  if (!googleMaps.value) return null

  const icons = {
    bar: {
      path: 'M21,5V3H3v2l8,9v5H6v2h12v-2h-5v-5L21,5z M5.23,5h13.54l-1.81,2H7.04L5.23,5z',
      fillColor: '#ff4646',
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: '#ffffff',
      scale: 1.8,
      anchor: new googleMaps.value.Point(12, 12)
    },
    restaurant: {
      path: 'M8.1,13.34l2.83-2.83L3.91,3.5c-1.56,1.56-1.56,4.09,0,5.66l4.19,4.18z M14.88,11.53c1.53,0.71,3.68,0.21,5.27-1.38 c1.91-1.91,2.28-4.65,0.81-6.12c-1.46-1.46-4.2-1.1-6.12,0.81c-1.59,1.59-2.09,3.74-1.38,5.27L3.7,19.87l1.41,1.41L12,14.41l6.88,6.88 l1.41-1.41L13.41,13L14.88,11.53z',
      fillColor: '#ff4646',
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: '#ffffff',
      scale: 1.8,
      anchor: new googleMaps.value.Point(12, 12)
    },
    apartment: {
      path: 'M17,11V3H7v4H3v14h8v-4h2v4h8V11H17z M7,19H5v-2h2V19z M7,15H5v-2h2V15z M7,11H5V9h2V11z M11,15H9v-2h2V15z M11,11H9V9h2 V11z M11,7H9V5h2V7z M15,15h-2v-2h2V15z M15,11h-2V9h2V11z M15,7h-2V5h2V7z M19,19h-2v-2h2V19z M19,15h-2v-2h2V15z',
      fillColor: '#646cff',
      fillOpacity: 1,
      strokeWeight: 2,
      strokeColor: '#ffffff',
      scale: 1.8,
      anchor: new googleMaps.value.Point(12, 12)
    }
  }

  return icons[type]
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Batch fetch place types with retry logic
async function initializePlaceTypes(retries = 3) {
  if (props.places.length === 0) return

  // First check if Supabase connection is established
  const isConnected = await checkConnection()
  if (!isConnected) {
    console.error('Unable to establish Supabase connection')
    // Set default types for all places
    props.places.forEach(place => {
      placeTypeCache.value.set(place.id, 'restaurant')
    })
    return
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { data, error } = await supabase
        .from('place_type_relations')
        .select(`
          place_id,
          place_types (
            name
          )
        `)
        .in('place_id', props.places.map(p => p.id))

      if (error) throw error

      // Clear existing cache
      placeTypeCache.value.clear()

      // Update cache with new data
      if (data) {
        data.forEach((relation) => {
          if (relation.place_types && relation.place_types.length > 0) {
            placeTypeCache.value.set(
              relation.place_id,
              relation.place_types[0].name as 'bar' | 'restaurant'
            )
          }
        })
      }

      // If successful, break the retry loop
      break
    } catch (error) {
      console.error(`Error fetching place types (attempt ${attempt}/${retries}):`, error)
      
      if (attempt === retries) {
        // On final attempt, set default types
        props.places.forEach(place => {
          placeTypeCache.value.set(place.id, 'restaurant')
        })
      } else {
        // Wait before retrying with exponential backoff
        await delay(1000 * Math.pow(2, attempt - 1))
      }
    }
  }
}

onMounted(async () => {
  if (mapContainer.value) {
    try {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: 'weekly'
      })

      await loader.load()
      const { MarkerClusterer } = await import('@googlemaps/markerclusterer')
      const { GridAlgorithm } = await import('@googlemaps/markerclusterer')
      googleMaps.value = markRaw(google.maps)

      const mapInstance = new google.maps.Map(mapContainer.value, {
        center: { lat: 40.7831, lng: -73.9712 },
        zoom: 13,
        styles: [
          {
            featureType: 'all',
            elementType: 'all',
            stylers: [
              { saturation: -20 },
              { lightness: 10 }
            ]
          }
        ]
      })

      map.value = markRaw(mapInstance)

      // Configure clustering algorithm
      const algorithm = new GridAlgorithm({
        maxZoom: 17, // Increased max zoom level
        gridSize: 50  // Adjusted grid size
      })

      const clusterer = new MarkerClusterer({
        map: mapInstance,
        algorithm,
        renderer: {
          render: ({ count, position }) => {
            return new google.maps.Marker({
              position,
              label: {
                text: String(count),
                color: 'white',
                fontSize: '13px',
                fontWeight: 'bold'
              },
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: Math.max(15, Math.min(count * 2.5, 30)),
                fillColor: '#646cff',
                fillOpacity: 0.9,
                strokeWeight: 2,
                strokeColor: '#ffffff'
              },
              zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count
            })
          }
        }
      })

      markerClusterer.value = markRaw(clusterer)

      // Add map event listeners
      mapInstance.addListener('idle', () => {
        const bounds = mapInstance.getBounds()
        if (bounds) {
          emit('boundsChanged', bounds)
        }
      })

      mapInstance.addListener('click', () => {
        handleCloseInfoPane()
      })

      // Initialize data
      await initializePlaceTypes()
      await updateMarkers()

      // Check for initial selected item
      if (props.selectedId) {
        const item = [...props.apartments, ...props.places].find(
          item => item.id.toString() === props.selectedId
        )
        if (item) {
          selectedItem.value = item
          selectedType.value = 'title' in item ? 'apartment' : 'place'
          showInfoPane.value = true
        }
      }
    } catch (error) {
      console.error('Error loading Google Maps:', error)
    }
  }
})

function getPlaceType(place: Place): 'bar' | 'restaurant' {
  return placeTypeCache.value.get(place.id) || 'restaurant'
}

async function updateMarkers() {
  if (!map.value || !markerClusterer.value || !googleMaps.value) return

  // Remove existing markers
  markers.value.forEach(marker => {
    marker.setMap(null)
  })
  markers.value = []

  // Clear clusterer
  markerClusterer.value.clearMarkers()

  const newMarkers: google.maps.Marker[] = []

  // Add apartment markers
  props.apartments.forEach(apartment => {
    if (!googleMaps.value) return

    const marker = new google.maps.Marker({
      position: { lat: apartment.latitude, lng: apartment.longitude },
      title: apartment.title,
      icon: createMarkerIcon('apartment'),
      optimized: true,
      zIndex: 1
    })

    marker.addListener('click', () => {
      handleMarkerClick(apartment, 'apartment')
    })

    newMarkers.push(marker)
  })

  // Add place markers
  props.places.forEach(place => {
    if (!googleMaps.value) return

    const placeType = getPlaceType(place)
    const marker = new google.maps.Marker({
      position: { lat: Number(place.latitude), lng: Number(place.longitude) },
      title: place.name,
      icon: createMarkerIcon(placeType),
      optimized: true,
      zIndex: 2
    })

    marker.addListener('click', () => {
      handleMarkerClick(place, 'place')
    })

    newMarkers.push(marker)
  })

  // Add markers to clusterer
  if (newMarkers.length > 0) {
    markerClusterer.value.addMarkers(newMarkers)
    markers.value = newMarkers
  }
}

function handleMarkerClick(item: Apartment | Place, type: 'apartment' | 'place') {
  // First update the state
  selectedItem.value = item
  selectedType.value = type
  showInfoPane.value = true

  // Then emit the event
  emit('select', item.id.toString())

  // Pan to the marker
  if (map.value) {
    map.value.panTo({ 
      lat: Number(item.latitude), 
      lng: Number(item.longitude) 
    })
    map.value.setZoom(16)
  }
}

watch(() => props.apartments, updateMarkers, { deep: true })
watch(() => props.places, async (newPlaces) => {
  if (newPlaces.length > 0) {
    await initializePlaceTypes()
    await updateMarkers()
  }
}, { deep: true })

watch(() => props.selectedId, (newId) => {
  if (newId && map.value) {
    const item = [...props.apartments, ...props.places].find(
      item => item.id.toString() === newId
    )
    if (item) {
      map.value.panTo({ 
        lat: Number(item.latitude), 
        lng: Number(item.longitude) 
      })
      map.value.setZoom(16)
      
      selectedItem.value = item
      selectedType.value = 'title' in item ? 'apartment' : 'place'
      showInfoPane.value = true
    }
  }
})

function handleCloseInfoPane() {
  selectedItem.value = null
  selectedType.value = null
  showInfoPane.value = false
}
</script>

<template>
  <div ref="mapContainer" class="map-container">
    <Transition name="fade">
      <InfoPane
        v-if="showInfoPane && selectedItem && selectedType"
        :item="selectedItem"
        :type="selectedType"
        @close="handleCloseInfoPane"
      />
    </Transition>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
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