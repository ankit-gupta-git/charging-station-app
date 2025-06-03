<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <!-- Navigation Bar -->
    <nav class="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <span class="text-white font-bold text-xl">Charging Station Manager</span>
          </div>
          <div class="flex items-center space-x-4">
            <router-link 
              to="/map" 
              class="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clip-rule="evenodd" />
              </svg>
              Map View
            </router-link>
            <button 
              @click="handleLogout" 
              class="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v3a1 1 0 102 0V9z" clip-rule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-bold text-white">Charging Stations</h2>
          <button 
            @click="showAddModal = true" 
            class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg"
          >
            Add New Station
          </button>
        </div>

        <div class="flex gap-4 mb-8">
          <select 
            v-model="filters.status"
            class="px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select 
            v-model="filters.connectorType"
            class="px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Connector Types</option>
            <option value="Type 1">Type 1</option>
            <option value="Type 2">Type 2</option>
            <option value="CCS">CCS</option>
            <option value="CHAdeMO">CHAdeMO</option>
          </select>
          <input
            type="number"
            v-model="filters.minPower"
            placeholder="Min Power (kW)"
            class="px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
          />
        </div>

        <div v-if="error" class="mb-4 p-4 bg-red-900/50 text-red-200 rounded-md border border-red-800">
          {{ error }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="station in filteredStations" 
            :key="station._id" 
            class="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-gray-700/50 hover:border-green-500/50 transition-colors duration-200"
          >
            <h3 class="text-xl font-semibold text-white mb-4">{{ station.name }}</h3>
            <div class="space-y-2 text-gray-300">
              <p><span class="font-medium text-green-400">Status:</span> {{ station.status }}</p>
              <p><span class="font-medium text-green-400">Power Output:</span> {{ station.powerOutput }} kW</p>
              <p><span class="font-medium text-green-400">Connector Type:</span> {{ station.connectorType }}</p>
              <p><span class="font-medium text-green-400">Location:</span> {{ station.location.latitude }}, {{ station.location.longitude }}</p>
            </div>
            <div class="flex gap-2 mt-4">
              <button 
                @click="editStation(station)" 
                class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-md"
              >
                Edit
              </button>
              <button 
                @click="deleteStation(station._id)" 
                class="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Add/Edit Modal -->
        <div v-if="showAddModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div class="bg-gray-900 rounded-lg shadow-2xl p-6 w-full max-w-md relative overflow-hidden border border-gray-700/50">
            <!-- Background Image -->
            <div class="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80" 
                alt="Charging Station Background"
                class="w-full h-full object-cover opacity-20"
              />
              <div class="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-gray-800/95"></div>
            </div>
            
            <!-- Content -->
            <div class="relative z-10">
              <h3 class="text-2xl font-bold text-white mb-6 text-center">
                {{ editingStation ? 'Edit Station' : 'Add New Station' }}
              </h3>
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input 
                    v-model="stationForm.name" 
                    required
                    class="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter station name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Latitude</label>
                  <input 
                    type="number" 
                    v-model="stationForm.location.latitude" 
                    required 
                    step="any"
                    class="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter latitude"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Longitude</label>
                  <input 
                    type="number" 
                    v-model="stationForm.location.longitude" 
                    required 
                    step="any"
                    class="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter longitude"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <select 
                    v-model="stationForm.status" 
                    required
                    class="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Power Output (kW)</label>
                  <input 
                    type="number" 
                    v-model="stationForm.powerOutput" 
                    required
                    class="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter power output"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-1">Connector Type</label>
                  <select 
                    v-model="stationForm.connectorType" 
                    required
                    class="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                  >
                    <option value="Type 1">Type 1</option>
                    <option value="Type 2">Type 2</option>
                    <option value="CCS">CCS</option>
                    <option value="CHAdeMO">CHAdeMO</option>
                  </select>
                </div>
                <div class="flex gap-4 mt-6">
                  <button 
                    type="submit"
                    :disabled="loading"
                    class="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:from-green-300 disabled:to-green-400 disabled:cursor-not-allowed shadow-lg"
                  >
                    {{ loading ? 'Saving...' : (editingStation ? 'Update' : 'Add') }}
                  </button>
                  <button 
                    type="button" 
                    @click="closeModal"
                    class="flex-1 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-md hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const stations = ref([])
const showAddModal = ref(false)
const editingStation = ref(null)
const loading = ref(false)
const error = ref('')

const filters = ref({
  status: '',
  connectorType: '',
  minPower: ''
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
    if (filters.value.connectorType && station.connectorType !== filters.value.connectorType) return false
    if (filters.value.minPower && station.powerOutput < Number(filters.value.minPower)) return false
    return true
  })
})

const fetchStations = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const response = await axios.get('http://localhost:4000/api/stations', {
      headers: { Authorization: `Bearer ${token}` }
    })
    stations.value = response.data
    error.value = ''
  } catch (err) {
    error.value = err.response?.data?.message || 'Error fetching stations'
    if (err.response?.status === 401) {
      router.push('/login')
    }
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    const token = localStorage.getItem('token')
    
    if (!token) {
      router.push('/login')
      return
    }

    const headers = { Authorization: `Bearer ${token}` }
    
    if (editingStation.value) {
      await axios.put(
        `http://localhost:4000/api/stations/${editingStation.value._id}`,
        stationForm.value,
        { headers }
      )
    } else {
      await axios.post(
        'http://localhost:4000/api/stations',
        stationForm.value,
        { headers }
      )
    }
    
    await fetchStations()
    closeModal()
  } catch (err) {
    error.value = err.response?.data?.message || 'Error saving station'
    if (err.response?.status === 401) {
      router.push('/login')
    }
  } finally {
    loading.value = false
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
    loading.value = true
    error.value = ''
    const token = localStorage.getItem('token')
    
    if (!token) {
      router.push('/login')
      return
    }

    await axios.delete(`http://localhost:4000/api/stations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    await fetchStations()
  } catch (err) {
    error.value = err.response?.data?.message || 'Error deleting station'
    if (err.response?.status === 401) {
      router.push('/login')
    }
  } finally {
    loading.value = false
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
  error.value = ''
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(fetchStations)
</script> 