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
              to="/stations" 
              class="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-md transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              List View
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
        <div class="relative w-full h-[calc(100vh-12rem)] rounded-lg overflow-hidden shadow-2xl border border-gray-700/50">
          <div ref="mapContainer" class="w-full h-full"></div>
          
          <!-- Station Details Popup -->
          <div 
            v-if="selectedStation" 
            class="absolute top-4 right-4 bg-gray-800/90 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-sm border border-gray-700/50 transform transition-all duration-300 ease-in-out"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold text-white">{{ selectedStation.name }}</h3>
              <span 
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  selectedStation.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                ]"
              >
                {{ selectedStation.status }}
              </span>
            </div>
            
            <div class="space-y-3 text-sm text-gray-300">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 4.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V4.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1zm0 2.445L6.237 7.582 5 13.5l2.667 1.019A1.99 1.99 0 0110 15c.84 0 1.6-.373 2.133-.981L15 13.5l-1.237-5.918L10 4.445z" clip-rule="evenodd" />
                </svg>
                <span class="font-medium text-green-400">Power Output:</span>
                <span class="ml-2">{{ selectedStation.powerOutput }} kW</span>
              </div>
              
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd" />
                </svg>
                <span class="font-medium text-green-400">Connector Type:</span>
                <span class="ml-2">{{ selectedStation.connectorType }}</span>
              </div>
              
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                <span class="font-medium text-green-400">Location:</span>
                <span class="ml-2">{{ selectedStation.location.latitude }}, {{ selectedStation.location.longitude }}</span>
              </div>
            </div>
            
            <button 
              @click="selectedStation = null"
              class="mt-6 w-full px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-md hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const mapContainer = ref(null)
const map = ref(null)
const stations = ref([])
const selectedStation = ref(null)
const markers = ref([])

const initMap = () => {
  map.value = L.map(mapContainer.value).setView([51.505, -0.09], 13)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value)
}

const fetchStations = async () => {
  try {
    // For testing, use the public endpoint
    const response = await axios.get('https://charging-station-app-uh1m.onrender.com/api/public/stations')
    stations.value = response.data
    addMarkersToMap()
  } catch (error) {
    console.error('Error fetching stations:', error)
  }
}

const addMarkersToMap = () => {
  // Clear existing markers
  markers.value.forEach(marker => marker.remove())
  markers.value = []

  // Create a bounds object to fit all markers
  const bounds = L.latLngBounds([])

  stations.value.forEach(station => {
    // Create custom icon
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div class="w-6 h-6 rounded-full border-2 border-white shadow-lg ${
        station.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
      }"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })

    // Create marker with custom icon
    const marker = L.marker(
      [station.location.latitude, station.location.longitude],
      { icon }
    ).addTo(map.value)

    // Create tooltip content
    const tooltipContent = `
      <div class="p-2">
        <div class="font-semibold text-gray-900">${station.name}</div>
        <div class="text-sm text-gray-700">
          <span class="font-medium">Status:</span> ${station.status}<br>
          <span class="font-medium">Power:</span> ${station.powerOutput} kW<br>
          <span class="font-medium">Type:</span> ${station.connectorType}
        </div>
      </div>
    `

    // Add tooltip
    marker.bindTooltip(tooltipContent, {
      permanent: false,
      direction: 'top',
      className: 'custom-tooltip',
      offset: [0, -10]
    })

    // Add click event handler
    marker.on('click', () => {
      // Set the selected station
      selectedStation.value = { ...station }
      
      // Center the map on the clicked marker
      map.value.setView(
        [station.location.latitude, station.location.longitude],
        15,
        { animate: true }
      )
    })

    // Add to markers array and bounds
    markers.value.push(marker)
    bounds.extend([station.location.latitude, station.location.longitude])
  })

  // Fit the map to show all markers with some padding
  if (stations.value.length > 0) {
    map.value.fitBounds(bounds, { padding: [50, 50] })
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(() => {
  initMap()
  fetchStations()
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>

<style>
.leaflet-container {
  background-color: #1a1a1a !important;
}

.leaflet-control-zoom a {
  background-color: #374151 !important;
  color: #fff !important;
  border-color: #4B5563 !important;
}

.leaflet-control-zoom a:hover {
  background-color: #4B5563 !important;
}

.custom-marker {
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-marker div {
  transition: transform 0.2s;
}

.custom-marker:hover div {
  transform: scale(1.2);
}

/* Custom tooltip styles */
.custom-tooltip {
  background-color: rgba(31, 41, 55, 0.95) !important;
  border: 1px solid rgba(75, 85, 99, 0.5) !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  color: #fff !important;
  font-size: 0.875rem !important;
  padding: 0.5rem !important;
  backdrop-filter: blur(4px) !important;
}

.custom-tooltip::before {
  border-top-color: rgba(75, 85, 99, 0.5) !important;
}

.custom-tooltip .leaflet-tooltip-content {
  margin: 0 !important;
}

.custom-tooltip .font-semibold {
  color: #fff !important;
  font-size: 1rem !important;
  margin-bottom: 0.25rem !important;
}

.custom-tooltip .text-sm {
  color: #d1d5db !important;
}

.custom-tooltip .font-medium {
  color: #9ca3af !important;
}
</style> 