<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-black text-white py-6 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold">VSA Dashboard Manager</h1>
        <p class="text-gray-400 mt-1">Manage images and statistics</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      <!-- Image Assets Section -->
      <section class="mb-12 bg-gray-50 rounded-lg p-6 border-2 border-black">
        <h2 class="text-2xl font-bold mb-6 text-black">Image Assets</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="key in assetKeys" 
            :key="key"
            class="bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-black transition-colors"
          >
            <label class="block text-sm font-semibold text-black mb-2">
              {{ formatLabel(key) }}
            </label>
            
            <!-- Current Image Preview -->
            <div class="mb-3 border-2 border-gray-200 rounded overflow-hidden bg-gray-100">
              <img 
                v-if="currentImages[key]"
                :src="'http://localhost:3000' + currentImages[key]" 
                :alt="key"
                class="w-full h-32 object-contain"
              />
              <div v-else class="w-full h-32 flex items-center justify-center text-gray-400">
                No Image
              </div>
            </div>

            <!-- New Image Preview -->
            <div 
              v-if="imageFiles[key]?.preview" 
              class="mb-3 border-2 border-black rounded overflow-hidden"
            >
              <img 
                :src="imageFiles[key].preview" 
                :alt="`New ${key}`"
                class="w-full h-32 object-contain"
              />
            </div>

            <!-- File Input -->
            <input 
              type="file"
              :id="`file-${key}`"
              accept="image/*"
              @change="handleImageChange(key, $event)"
              class="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-2 file:border-black file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-black hover:file:text-white file:cursor-pointer cursor-pointer"
            />
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button 
            @click="updateImageAssets"
            :disabled="!hasImageUpdates || isUpdatingImages"
            class="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {{ isUpdatingImages ? 'Updating...' : 'Update Images' }}
          </button>
        </div>

        <!-- Success/Error Message for Images -->
        <div v-if="imageMessage" :class="['mt-4 p-4 rounded', imageMessage.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-800' : 'bg-red-100 text-red-800 border-2 border-red-800']">
          {{ imageMessage.text }}
        </div>
      </section>

      <!-- Stats Section -->
      <section class="bg-gray-50 rounded-lg p-6 border-2 border-black">
        <h2 class="text-2xl font-bold mb-6 text-black">Dashboard Statistics</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            v-for="stat in stats" 
            :key="stat.key"
            class="bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-black transition-colors"
          >
            <label class="block text-sm font-semibold text-black mb-2">
              {{ formatLabel(stat.key) }}
            </label>

            <!-- Current Stat Display -->
            <div class="mb-4 p-3 bg-gray-100 rounded border border-gray-300">
              <div class="flex items-center gap-3">
                <img 
                  v-if="stat.currentImage"
                  :src="'http://localhost:3000' + stat.currentImage" 
                  :alt="stat.key"
                  class="w-12 h-12 object-contain"
                />
                <div>
                  <p class="text-xs text-gray-600">Current Value</p>
                  <p class="text-lg font-bold text-black">{{ stat.currentValue || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- New Image Preview -->
            <div 
              v-if="stat.newImagePreview" 
              class="mb-3 border-2 border-black rounded p-2"
            >
              <p class="text-xs text-gray-600 mb-1">New Image</p>
              <img 
                :src="stat.newImagePreview" 
                :alt="`New ${stat.key}`"
                class="w-12 h-12 object-contain"
              />
            </div>

            <!-- Value Input -->
            <div class="mb-3">
              <label class="block text-xs text-gray-600 mb-1">New Value</label>
              <input 
                v-model="stat.newValue"
                type="text"
                placeholder="Enter new value"
                class="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none"
              />
            </div>

            <!-- Image Input -->
            <div>
              <label class="block text-xs text-gray-600 mb-1">New Image</label>
              <input 
                type="file"
                :id="`stat-file-${stat.key}`"
                accept="image/*"
                @change="handleStatImageChange(stat.key, $event)"
                class="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-2 file:border-black file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-black hover:file:text-white file:cursor-pointer cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button 
            @click="updateStats"
            :disabled="!hasStatUpdates || isUpdatingStats"
            class="px-6 py-3 bg-black text-white font-semibold rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {{ isUpdatingStats ? 'Updating...' : 'Update Statistics' }}
          </button>
        </div>

        <!-- Success/Error Message for Stats -->
        <div v-if="statsMessage" :class="['mt-4 p-4 rounded', statsMessage.type === 'success' ? 'bg-green-100 text-green-800 border-2 border-green-800' : 'bg-red-100 text-red-800 border-2 border-red-800']">
          {{ statsMessage.text }}
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Image Assets
      assetKeys: [
        "logo_image", "hero_image", "skate_icon", "check_icon", 
        "roller_skate_image", "ice_skate_image", "skating_banner", 
        "roller_speed_image", "roller_icon", "ice_icon", "ice_speed_image"
      ],
      currentImages: {},
      imageFiles: {},
      isUpdatingImages: false,
      imageMessage: null,

      // Stats
      stats: [
        { key: "Active_Students", currentValue: "", currentImage: "", newValue: "", newImage: null, newImagePreview: null },
        { key: "Expert_Coaches", currentValue: "", currentImage: "", newValue: "", newImage: null, newImagePreview: null },
        { key: "Championships_Won", currentValue: "", currentImage: "", newValue: "", newImage: null, newImagePreview: null },
        { key: "Years_Experience", currentValue: "", currentImage: "", newValue: "", newImage: null, newImagePreview: null }
      ],
      isUpdatingStats: false,
      statsMessage: null,

      // API Base URL - adjust as needed
      apiBaseUrl: "http://localhost:3000/vsa"
    };
  },
  computed: {
    hasImageUpdates() {
      return Object.keys(this.imageFiles).length > 0;
    },
    hasStatUpdates() {
      return this.stats.some(stat => stat.newValue || stat.newImage);
    }
  },
  mounted() {
    this.fetchDashboardData();
  },
  methods: {
    formatLabel(key) {
      return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },

    async fetchDashboardData() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/dashboard`);
        const data = await response.json();

        if (data.success) {
          // Populate current images
          this.currentImages = { ...data.data.images };

          // Populate current stats
          data.data.stats.forEach(stat => {
            const statObj = this.stats.find(s => s.key === stat.label.replace(/ /g, '_'));
            if (statObj) {
              statObj.currentValue = stat.value;
              statObj.currentImage = stat.image;
            }
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    },

    handleImageChange(key, event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageFiles[key] = {
            file: file,
            preview: e.target.result
          };
        };
        reader.readAsDataURL(file);
      }
    },

    handleStatImageChange(key, event) {
      const file = event.target.files[0];
      if (file) {
        const stat = this.stats.find(s => s.key === key);
        if (stat) {
          const reader = new FileReader();
          reader.onload = (e) => {
            stat.newImage = file;
            stat.newImagePreview = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }
    },

    async updateImageAssets() {
      this.isUpdatingImages = true;
      this.imageMessage = null;

      const formData = new FormData();
      Object.keys(this.imageFiles).forEach(key => {
        formData.append(key, this.imageFiles[key].file);
      });

      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`${this.apiBaseUrl}/admin/edit-image-assets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'PUT',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          this.imageMessage = { type: 'success', text: data.message };
          this.imageFiles = {};
          // Clear file inputs
          this.assetKeys.forEach(key => {
            const input = document.getElementById(`file-${key}`);
            if (input) input.value = '';
          });
          await this.fetchDashboardData();
        } else {
          this.imageMessage = { type: 'error', text: data.message };
        }
      } catch (error) {
        this.imageMessage = { type: 'error', text: 'Failed to update images' };
      } finally {
        this.isUpdatingImages = false;
      }
    },

    async updateStats() {
      this.isUpdatingStats = true;
      this.statsMessage = null;

      const formData = new FormData();
      const values = {};

      this.stats.forEach(stat => {
        if (stat.newValue) {
          values[stat.key] = stat.newValue;
        }
        if (stat.newImage) {
          formData.append(stat.key, stat.newImage);
        }
      });

      if (Object.keys(values).length > 0) {
        formData.append('values', JSON.stringify(values));
      }

      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`${this.apiBaseUrl}/admin/edit-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'PUT',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          this.statsMessage = { type: 'success', text: data.message };
          // Clear inputs
          this.stats.forEach(stat => {
            stat.newValue = '';
            stat.newImage = null;
            stat.newImagePreview = null;
            const input = document.getElementById(`stat-file-${stat.key}`);
            if (input) input.value = '';
          });
          await this.fetchDashboardData();
        } else {
          this.statsMessage = { type: 'error', text: data.message };
        }
      } catch (error) {
        this.statsMessage = { type: 'error', text: 'Failed to update statistics' };
      } finally {
        this.isUpdatingStats = false;
      }
    }
  }
};
</script>