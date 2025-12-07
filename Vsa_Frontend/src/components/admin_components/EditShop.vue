<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="$router.back()"
          class="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">Edit Shop Items</h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {{ error }}
      </div>

      <!-- Items Grid -->
      <div v-else>
        <!-- Skates and Boots Section -->
        <div v-if="skatesAndBootsData.length > 0" class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span class="w-2 h-8 bg-blue-600 rounded mr-3"></span>
            Skates & Boots
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ItemCard
              v-for="item in skatesAndBootsData"
              :key="item.item_id"
              :item="item"
              @click="navigateToItemDetails('skatesAndBoots', item.item_id)"
            />
          </div>
        </div>

        <!-- Wheels Section -->
        <div v-if="wheelsData.length > 0" class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span class="w-2 h-8 bg-green-600 rounded mr-3"></span>
            Wheels
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ItemCard
              v-for="item in wheelsData"
              :key="item.item_id"
              :item="item"
              @click="navigateToItemDetails('wheels', item.item_id)"
            />
          </div>
        </div>

        <!-- Helmets Section -->
        <div v-if="helmetsData.length > 0" class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span class="w-2 h-8 bg-purple-600 rounded mr-3"></span>
            Helmets
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ItemCard
              v-for="item in helmetsData"
              :key="item.item_id"
              :item="item"
              @click="navigateToItemDetails('helmets', item.item_id)"
            />
          </div>
        </div>

        <!-- Bearings Section -->
        <div v-if="bearingsData.length > 0" class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span class="w-2 h-8 bg-orange-600 rounded mr-3"></span>
            Bearings
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ItemCard
              v-for="item in bearingsData"
              :key="item.item_id"
              :item="item"
              @click="navigateToItemDetails('bearings', item.item_id)"
            />
          </div>
        </div>

        <!-- Accessories Section -->
        <div v-if="accessoriesData.length > 0" class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <span class="w-2 h-8 bg-red-600 rounded mr-3"></span>
            Accessories
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ItemCard
              v-for="item in accessoriesData"
              :key="item.item_id"
              :item="item"
              @click="navigateToItemDetails('accessories', item.item_id)"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!hasAnyItems" class="text-center py-20">
          <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 class="mt-4 text-xl font-medium text-gray-900">No items found</h3>
          <p class="mt-2 text-gray-500">Get started by adding your first item.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditShop',
  data() {
    return {
      loading: true,
      error: null,
      skatesAndBootsData: [],
      wheelsData: [],
      helmetsData: [],
      bearingsData: [],
      accessoriesData: []
    };
  },
  computed: {
    hasAnyItems() {
      return (
        this.skatesAndBootsData.length > 0 ||
        this.wheelsData.length > 0 ||
        this.helmetsData.length > 0 ||
        this.bearingsData.length > 0 ||
        this.accessoriesData.length > 0
      );
    }
  },
  mounted() {
    this.fetchShopItems();
  },
  methods: {
    async fetchShopItems() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get('http://localhost:3000/vsa/admin/edit-shop-items', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          this.skatesAndBootsData = response.data.skatesAndBootsData || [];
          this.wheelsData = response.data.wheelsData || [];
          this.helmetsData = response.data.helmetsData || [];
          this.bearingsData = response.data.bearingsData || [];
          this.accessoriesData = response.data.accessoriesData || [];
        } else {
          this.error = response.data.message || 'Failed to fetch shop items';
        }
      } catch (err) {
        console.error('Error fetching shop items:', err);
        this.error = err.response?.data?.message || 'An error occurred while fetching items';
      } finally {
        this.loading = false;
      }
    },
    navigateToItemDetails(itemType, itemId) {
      this.$router.push({
        name: 'EditItem',
        params: { itemType, itemId }
      });
    }
  },
  components: {
    ItemCard: {
      template: `
        <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer group">
          <div class="relative h-48 bg-gray-200 overflow-hidden">
            <img
              v-if="item.main_image_path"
              :src="item.main_image_path"
              :alt="item.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div v-if="!item.is_shown" class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Hidden
            </div>
            <div v-if="item.deleted_at" class="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
              Deleted
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-lg text-gray-900 mb-2 truncate" :title="item.name">
              {{ item.name }}
            </h3>
            <p v-if="item.short_description" class="text-sm text-gray-600 line-clamp-2 mb-3">
              {{ item.short_description }}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="ml-1 text-sm text-gray-700">
                  {{ item.average_rating || '0.0' }}
                </span>
              </div>
              <span class="text-xs text-gray-500">ID: {{ item.item_id }}</span>
            </div>
          </div>
        </div>
      `,
      props: ['item'],
      methods: {
        handleImageError(e) {
          e.target.style.display = 'none';
        }
      }
    }
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>