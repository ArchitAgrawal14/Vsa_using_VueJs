<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Edit Shop Items</h1>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Skates and Boots Section -->
        <section v-if="skatesAndBootsData.length > 0" class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Skates & Boots</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ItemCard
              v-for="item in skatesAndBootsData"
              :key="item.item_id"
              :item="item"
              itemType="skatesAndBoots"
            />
          </div>
        </section>

        <!-- Wheels Section -->
        <section v-if="wheelsData.length > 0" class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Wheels</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ItemCard
              v-for="item in wheelsData"
              :key="item.item_id"
              :item="item"
              itemType="wheels"
            />
          </div>
        </section>

        <!-- Helmets Section -->
        <section v-if="helmetsData.length > 0" class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Helmets</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ItemCard
              v-for="item in helmetsData"
              :key="item.item_id"
              :item="item"
              itemType="helmets"
            />
          </div>
        </section>

        <!-- Bearings Section -->
        <section v-if="bearingsData.length > 0" class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Bearings</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ItemCard
              v-for="item in bearingsData"
              :key="item.item_id"
              :item="item"
              itemType="bearings"
            />
          </div>
        </section>

        <!-- Accessories Section -->
        <section v-if="accessoriesData.length > 0" class="mb-12">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Accessories</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ItemCard
              v-for="item in accessoriesData"
              :key="item.item_id"
              :item="item"
              itemType="accessories"
            />
          </div>
        </section>

        <!-- Empty State -->
        <div v-if="isEmpty" class="text-center py-12">
          <p class="text-gray-500 text-lg">No items found</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ItemCard from './ItemCard.vue';
export default {
  name: 'EditShop',
  components: {
    ItemCard
  },
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
    isEmpty() {
      return (
        this.skatesAndBootsData.length === 0 &&
        this.wheelsData.length === 0 &&
        this.helmetsData.length === 0 &&
        this.bearingsData.length === 0 &&
        this.accessoriesData.length === 0
      );
    }
  },

  mounted() {
    this.fetchShopItems();
  },

  methods: {
    async fetchShopItems() {
      try {
        this.loading = true;
        this.error = null;

        const response = await fetch('http://localhost:3000/vsa/admin/edit-shop-items', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch shop items');
        }

        if (data.success) {
          this.skatesAndBootsData = data.skatesAndBootsData || [];
          this.wheelsData = data.wheelsData || [];
          this.helmetsData = data.helmetsData || [];
          this.bearingsData = data.bearingsData || [];
          this.accessoriesData = data.accessoriesData || [];
        } else {
          throw new Error(data.message || 'Failed to load items');
        }
      } catch (err) {
        console.error('Error fetching shop items:', err);
        this.error = err.message || 'Failed to load shop items. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>

<style scoped>
/* Add any additional custom styles here if needed */
</style>