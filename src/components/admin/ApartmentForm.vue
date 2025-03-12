<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-screen-xl mx-auto bg-gray-50 min-h-screen">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6 sm:p-8">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900">
          {{ isEditing ? 'Edit Apartment' : 'Create New Apartment' }}
        </h2>
        <p class="mt-1 text-sm text-gray-600">
          {{ isEditing ? 'Update the apartment details below.' : 'Fill in the apartment details below.' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <div class="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                v-model="form.name"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                placeholder="Enter apartment name"
              />
            </div>
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
            <div class="mt-1">
              <input
                type="text"
                name="address"
                id="address"
                v-model="form.address"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                placeholder="Enter apartment address"
              />
            </div>
          </div>

          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                v-model="form.price"
                required
                min="0"
                step="0.01"
                class="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors duration-200"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <router-link
            :to="isEditing ? '/admin/apartments' : '/apartments'"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </router-link>
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ isEditing ? 'Update Apartment' : 'Create Apartment' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isEditing = computed(() => route.params.id !== undefined)

const form = ref({
  name: '',
  address: '',
  price: 0
})

const fetchApartment = async (id: string) => {
  // TODO: Implement API call to fetch apartment details
  // form.value = await response.data
}

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      // TODO: Implement API call to update apartment
      // await axios.put(`/api/apartments/${route.params.id}`, form.value)
    } else {
      // TODO: Implement API call to create apartment
      // await axios.post('/api/apartments', form.value)
    }
    router.push('/admin/apartments')
  } catch (error) {
    console.error('Error saving apartment:', error)
  }
}

onMounted(async () => {
  if (isEditing.value && route.params.id) {
    await fetchApartment(route.params.id as string)
  }
})
</script>
