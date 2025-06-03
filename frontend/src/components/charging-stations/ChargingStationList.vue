<template>
  <div class="stations-container">
    <div class="filters">
      <div class="filter-group">
        <label for="status">Status</label>
        <select id="status" v-model="filters.status">
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      <div class="filter-group">
        <label for="powerOutput">Power Output (kW)</label>
        <input
          type="number"
          id="powerOutput"
          v-model="filters.powerOutput"
          placeholder="Filter by power output"
        />
      </div>
      <div class="filter-group">
        <label for="connectorType">Connector Type</label>
        <input
          type="text"
          id="connectorType"
          v-model="filters.connectorType"
          placeholder="Filter by connector type"
        />
      </div>
    </div>

    <div class="stations-list">
      <div v-if="loading" class="loading">Loading stations...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="filteredStations.length === 0" class="no-stations">
        No charging stations found
      </div>
      <div v-else class="stations-grid">
        <div v-for="station in filteredStations" :key="station._id" class="station-card">
          <h3>{{ station.name }}</h3>
          <div class="station-details">
            <p><strong>Status:</strong> {{ station.status }}</p>
            <p><strong>Power Output:</strong> {{ station.powerOutput }} kW</p>
            <p><strong>Connector Type:</strong> {{ station.connectorType }}</p>
            <p><strong>Location:</strong> {{ station.location.latitude }}, {{ station.location.longitude }}</p>
          </div>
          <div class="station-actions">
            <button @click="editStation(station)" class="edit-btn">Edit</button>
            <button @click="deleteStation(station._id)" class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <button @click="showAddModal = true" class="add-btn">Add New Station</button>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h2>{{ editingStation ? 'Edit Station' : 'Add New Station' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" v-model="stationForm.name" required />
          </div>
          <div class="form-group">
            <label for="latitude">Latitude</label>
            <input type="number" id="latitude" v-model="stationForm.location.latitude" required step="any" />
          </div>
          <div class="form-group">
            <label for="longitude">Longitude</label>
            <input type="number" id="longitude" v-model="stationForm.location.longitude" required step="any" />
          </div>
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="stationForm.status" required>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="form-group">
            <label for="powerOutput">Power Output (kW)</label>
            <input type="number" id="powerOutput" v-model="stationForm.powerOutput" required min="0" />
          </div>
          <div class="form-group">
            <label for="connectorType">Connector Type</label>
            <input type="text" id="connectorType" v-model="stationForm.connectorType" required />
          </div>
          <div class="modal-actions">
            <button type="submit" :disabled="submitting">
              {{ submitting ? 'Saving...' : 'Save' }}
            </button>
            <button type="button" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'ChargingStationList',
  setup() {
    const stations = ref([])
    const loading = ref(false)
    const error = ref('')
    const showAddModal = ref(false)
    const submitting = ref(false)
    const editingStation = ref(null)

    const filters = ref({
      status: '',
      powerOutput: '',
      connectorType: ''
    })

    const stationForm = ref({
      name: '',
      location: {
        latitude: '',
        longitude: ''
      },
      status: 'Active',
      powerOutput: '',
      connectorType: ''
    })

    const filteredStations = computed(() => {
      return stations.value.filter(station => {
        if (filters.value.status && station.status !== filters.value.status) return false
        if (filters.value.powerOutput && station.powerOutput !== Number(filters.value.powerOutput)) return false
        if (filters.value.connectorType && !station.connectorType.toLowerCase().includes(filters.value.connectorType.toLowerCase())) return false
        return true
      })
    })

    const fetchStations = async () => {
      try {
        loading.value = true
        error.value = ''
        const response = await axios.get('http://localhost:5000/api/stations')
        stations.value = response.data
      } catch (err) {
        error.value = 'Error fetching stations'
        console.error(err)
      } finally {
        loading.value = false
      }
    }

    const handleSubmit = async () => {
      try {
        submitting.value = true
        const token = localStorage.getItem('token')
        
        if (editingStation.value) {
          await axios.put(
            `http://localhost:5000/api/stations/${editingStation.value._id}`,
            stationForm.value,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          )
        } else {
          await axios.post(
            'http://localhost:5000/api/stations',
            stationForm.value,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          )
        }

        await fetchStations()
        closeModal()
      } catch (err) {
        error.value = 'Error saving station'
        console.error(err)
      } finally {
        submitting.value = false
      }
    }

    const editStation = (station) => {
      editingStation.value = station
      stationForm.value = { ...station }
      showAddModal.value = true
    }

    const deleteStation = async (id) => {
      if (!confirm('Are you sure you want to delete this station?')) return

      try {
        const token = localStorage.getItem('token')
        await axios.delete(`http://localhost:5000/api/stations/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        await fetchStations()
      } catch (err) {
        error.value = 'Error deleting station'
        console.error(err)
      }
    }

    const closeModal = () => {
      showAddModal.value = false
      editingStation.value = null
      stationForm.value = {
        name: '',
        location: {
          latitude: '',
          longitude: ''
        },
        status: 'Active',
        powerOutput: '',
        connectorType: ''
      }
    }

    onMounted(fetchStations)

    return {
      stations,
      loading,
      error,
      filters,
      filteredStations,
      showAddModal,
      submitting,
      editingStation,
      stationForm,
      handleSubmit,
      editStation,
      deleteStation,
      closeModal
    }
  }
}
</script>

<style scoped>
.stations-container {
  padding: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.filter-group input,
.filter-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.stations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.station-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.station-card h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.station-details p {
  margin: 0.5rem 0;
  color: #666;
}

.station-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.edit-btn,
.delete-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn {
  background-color: #42b983;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.add-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-actions button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-actions button[type="submit"] {
  background-color: #42b983;
  color: white;
}

.modal-actions button[type="button"] {
  background-color: #6c757d;
  color: white;
}

.loading,
.error,
.no-stations {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
}
</style> 