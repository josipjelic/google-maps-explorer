<script setup lang="ts">
import { onMounted } from 'vue'
import { useApartments } from '../composables/useApartments'

const { apartments, loading, error, fetchApartments, deleteApartment } = useApartments()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this apartment?')) {
    await deleteApartment(id)
  }
}

onMounted(() => {
  fetchApartments()
})
</script>

<template>
  <div class="page-container">
    <div class="overlay"></div>
    <div class="apartments-container">
      <div class="header">
        <h1>Available Apartments</h1>
        <router-link to="/apartments/new" class="add-button">
          Add New Apartment
        </router-link>
      </div>

      <div v-if="loading" class="loading">Loading apartments...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="apartments.length === 0" class="no-apartments">
        No apartments available
      </div>
      <div v-else class="table-container">
        <table class="apartments-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Address</th>
              <th>Details</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="apartment in apartments" :key="apartment.id">
              <td class="image-cell">
                <img 
                  :src="apartment.images?.[0] || 'https://via.placeholder.com/300x200'" 
                  :alt="apartment.title"
                />
              </td>
              <td>{{ apartment.title }}</td>
              <td>{{ formatPrice(apartment.price) }}</td>
              <td>{{ apartment.address }}</td>
              <td class="specs-cell">
                <span v-if="apartment.bedrooms">{{ apartment.bedrooms }} beds</span>
                <span v-if="apartment.bathrooms">{{ apartment.bathrooms }} baths</span>
                <span v-if="apartment.area">{{ apartment.area }} m²</span>
              </td>
              <td>
                <span class="status" :class="apartment.status">{{ apartment.status }}</span>
              </td>
              <td class="actions-cell">
                <router-link :to="'/apartments/' + apartment.id" class="view-button">
                  View
                </router-link>
                <button @click="handleDelete(apartment.id)" class="delete-button">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.apartments-container {
  position: relative;
  z-index: 2;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: white;
  font-size: 2rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-button {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.add-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.table-container {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.apartments-table {
  width: 100%;
  border-collapse: collapse;
  color: white;
}

.apartments-table th,
.apartments-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.apartments-table th {
  background: rgba(255, 255, 255, 0.1);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.apartments-table tr:hover {
  background: rgba(255, 255, 255, 0.1);
}

.image-cell {
  width: 120px;
}

.image-cell img {
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
}

.specs-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.status {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status.available {
  background: rgba(72, 187, 120, 0.2);
  border: 1px solid rgba(72, 187, 120, 0.4);
  color: #68d391;
}

.status.rented {
  background: rgba(237, 137, 54, 0.2);
  border: 1px solid rgba(237, 137, 54, 0.4);
  color: #f6ad55;
}

.status.sold {
  background: rgba(229, 62, 62, 0.2);
  border: 1px solid rgba(229, 62, 62, 0.4);
  color: #fc8181;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.view-button,
.delete-button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  text-align: center;
  transition: all 0.3s ease;
  white-space: nowrap;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.view-button {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  text-decoration: none;
}

.delete-button {
  background: rgba(229, 62, 62, 0.1);
  color: #fc8181;
  border: 1px solid rgba(229, 62, 62, 0.2);
  cursor: pointer;
}

.view-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.delete-button:hover {
  background: rgba(229, 62, 62, 0.2);
}

.loading,
.error,
.no-apartments {
  text-align: center;
  padding: 2rem;
  color: white;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.error {
  color: #fc8181;
  background: rgba(229, 62, 62, 0.1);
  border-color: rgba(229, 62, 62, 0.2);
}

@media (max-width: 768px) {
  .apartments-container {
    padding: 1rem;
  }

  .table-container {
    border-radius: 16px;
  }

  .apartments-table th,
  .apartments-table td {
    padding: 0.75rem;
  }

  .image-cell {
    width: 80px;
  }

  .image-cell img {
    width: 70px;
    height: 50px;
  }
}
</style>