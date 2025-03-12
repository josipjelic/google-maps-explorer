<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-screen-xl mx-auto bg-gray-50 min-h-screen">
    <div class="sm:flex sm:items-center mb-8">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold text-gray-900">Apartments</h1>
        <p class="mt-2 text-sm text-gray-700">A list of all apartments in the system.</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <router-link
          to="/admin/apartments/create"
          class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Apartment
        </router-link>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="min-w-full overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Address</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr v-for="apartment in apartments" :key="apartment.id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {{ apartment.name }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ apartment.address }}</td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ formatPrice(apartment.price) }}</td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <router-link 
                  :to="'/admin/apartments/' + apartment.id + '/edit'" 
                  class="text-primary hover:text-primary-dark mr-4 inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </router-link>
                <button 
                  @click="deleteApartment(apartment.id)" 
                  class="text-red-600 hover:text-red-900 inline-flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="apartments.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                No apartments found. Click the "Add Apartment" button to create one.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Apartment {
  id: string
  name: string
  address: string
  price: number
}

const apartments = ref<Apartment[]>([])

const fetchApartments = async () => {
  // TODO: Implement API call to fetch apartments
  apartments.value = []
}

const deleteApartment = async (id: string) => {
  if (!confirm('Are you sure you want to delete this apartment?')) return
  // TODO: Implement API call to delete apartment
  await fetchApartments()
}

onMounted(() => {
  fetchApartments()
})
</script>
