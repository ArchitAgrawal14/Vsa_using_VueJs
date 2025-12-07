<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
      </h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <!-- Edit Shop Items Button -->
        <button
          @click="navigateToEditShop"
          class="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-8 sm:p-12"
        >
          <div class="relative z-10 flex flex-col items-center justify-center space-y-4">
            <svg
              class="w-16 h-16 sm:w-20 sm:h-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span class="text-xl sm:text-2xl font-semibold">Edit Shop Items</span>
            <span class="text-sm sm:text-base text-blue-100">
              Manage existing products
            </span>
          </div>
          <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </button>

        <!-- Add New Item Button -->
        <button
          @click="navigateToAddNew"
          class="group relative overflow-hidden bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-8 sm:p-12"
        >
          <div class="relative z-10 flex flex-col items-center justify-center space-y-4">
            <svg
              class="w-16 h-16 sm:w-20 sm:h-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span class="text-xl sm:text-2xl font-semibold">Add New Item</span>
            <span class="text-sm sm:text-base text-green-100">
              Create a new product
            </span>
          </div>
          <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ManageShop',
  methods: {
    navigateToEditShop() {
      this.$router.push('/vsa/admin/edit-shop');
    },
    navigateToAddNew() {
      this.$router.push('/vsa/admin/add-new-item');
    }
  }
};
</script>

<style scoped>
/* Additional custom styles if needed */
</style>