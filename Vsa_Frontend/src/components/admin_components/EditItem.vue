<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="$router.back()"
          class="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Items
        </button>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">Edit Item Details</h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
        {{ error }}
      </div>

      <!-- Edit Form -->
      <div v-else-if="itemData" class="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <form @submit.prevent="handleUpdate">
          <!-- Basic Information Section -->
          <div class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-blue-600">
              Basic Information
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Item ID (Read-only) -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Item ID</label>
                <input
                  type="text"
                  :value="itemData.item_id"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  v-model="formData.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Average Rating -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Average Rating</label>
                <input
                  v-model.number="formData.average_rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Main Image Path -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Main Image Path</label>
                <input
                  v-model="formData.main_image_path"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Is Shown -->
              <div class="flex items-center space-x-3">
                <input
                  v-model="formData.is_shown"
                  type="checkbox"
                  id="is_shown"
                  class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="is_shown" class="text-sm font-medium text-gray-700">
                  Show on website
                </label>
              </div>
            </div>

            <!-- Short Description -->
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
              <input
                v-model="formData.short_description"
                type="text"
                maxlength="150"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p class="text-xs text-gray-500 mt-1">{{ formData.short_description?.length || 0 }}/150 characters</p>
            </div>

            <!-- Detailed Description -->
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
              <textarea
                v-model="formData.detailed_description"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <!-- Why to Choose -->
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Why to Choose</label>
              <textarea
                v-model="formData.why_to_choose"
                rows="3"
                maxlength="255"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">{{ formData.why_to_choose?.length || 0 }}/255 characters</p>
            </div>

            <!-- Features -->
            <div class="mt-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <textarea
                v-model="formData.features"
                rows="4"
                placeholder="Enter features, one per line or comma-separated"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
          </div>

          <!-- Variations Section -->
          <div v-if="variations.length > 0" class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-green-600">
              Product Variations ({{ variations.length }})
            </h2>
            
            <div class="space-y-6">
              <div
                v-for="(variation, index) in variations"
                :key="variation.item_variation_id"
                class="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
              >
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-lg font-semibold text-gray-800">Variation {{ index + 1 }}</h3>
                  <span class="text-xs text-gray-500">ID: {{ variation.item_variation_id }}</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <!-- Color/ABEC Rating -->
                  <div v-if="variation.color">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <input
                      v-model="variation.color"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div v-if="variation.abec_rating">
                    <label class="block text-sm font-medium text-gray-700 mb-2">ABEC Rating</label>
                    <input
                      v-model="variation.abec_rating"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <!-- Size/Material -->
                  <div v-if="variation.size">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <input
                      v-model="variation.size"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div v-if="variation.material">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Material</label>
                    <input
                      v-model="variation.material"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <!-- Pack Size -->
                  <div v-if="variation.pack_size">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Pack Size</label>
                    <input
                      v-model.number="variation.pack_size"
                      type="number"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <!-- Bearing Type -->
                  <div v-if="variation.bearing_type">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Bearing Type</label>
                    <input
                      v-model="variation.bearing_type"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <!-- Quantity -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input
                      v-model.number="variation.quantity"
                      type="number"
                      min="0"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <!-- Current Price -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Current Price *</label>
                    <input
                      v-model.number="variation.current_price"
                      type="number"
                      step="0.01"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <!-- Old Price -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Old Price</label>
                    <input
                      v-model.number="variation.old_price"
                      type="number"
                      step="0.01"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <!-- Discount -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                    <input
                      v-model.number="variation.discount"
                      type="number"
                      min="0"
                      max="100"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <!-- Base Image Path -->
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Base Image Path</label>
                    <input
                      v-model="variation.base_image_path"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <!-- Checkboxes -->
                <div class="flex flex-wrap gap-6 mt-4">
                  <div class="flex items-center space-x-2">
                    <input
                      v-model="variation.show_on_main_page"
                      type="checkbox"
                      :id="`show_main_${index}`"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label :for="`show_main_${index}`" class="text-sm text-gray-700">Show on main page</label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input
                      v-model="variation.show_as_variation"
                      type="checkbox"
                      :id="`show_var_${index}`"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label :for="`show_var_${index}`" class="text-sm text-gray-700">Show as variation</label>
                  </div>
                </div>

                <!-- Variation Images -->
                <div v-if="variation.images && variation.images.length > 0" class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Variation Images</label>
                  <div class="flex flex-wrap gap-2">
                    <div
                      v-for="(img, imgIndex) in variation.images"
                      :key="imgIndex"
                      class="relative w-20 h-20 border border-gray-300 rounded"
                    >
                      <img
                        v-if="img"
                        :src="img"
                        class="w-full h-full object-cover rounded"
                        @error="handleImageError"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              :disabled="updating"
              class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <svg v-if="updating" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ updating ? 'Updating...' : 'Update Item' }}
            </button>
            <button
              type="button"
              @click="$router.back()"
              class="sm:flex-none bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>

        <!-- Success Message -->
        <div v-if="successMessage" class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          {{ successMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditItem',
  data() {
    return {
      loading: true,
      updating: false,
      error: null,
      successMessage: null,
      itemData: null,
      formData: {
        name: '',
        short_description: '',
        detailed_description: '',
        why_to_choose: '',
        main_image_path: '',
        features: '',
        average_rating: 0,
        is_shown: true
      },
      variations: []
    };
  },
  mounted() {
    this.fetchItemDetails();
  },
  methods: {
    async fetchItemDetails() {
      this.loading = true;
      this.error = null;

      try {
        const { itemType, itemId } = this.$route.params;

        const response = await axios.get('http://localhost:3000/vsa/admin/get-single-item', {
          params: {
            itemName: itemType,
            itemId: itemId
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success && response.data.item.length > 0) {
          const firstItem = response.data.item[0];
          
          // Set base item data
          this.itemData = firstItem;
          this.formData = {
            name: firstItem.name || '',
            short_description: firstItem.short_description || '',
            detailed_description: firstItem.detailed_description || '',
            why_to_choose: firstItem.why_to_choose || '',
            main_image_path: firstItem.main_image_path || '',
            features: firstItem.features || '',
            average_rating: firstItem.average_rating || 0,
            is_shown: firstItem.is_shown
          };

          // Process variations
          this.processVariations(response.data.item);
        } else {
          this.error = 'Item not found';
        }
      } catch (err) {
        console.error('Error fetching item details:', err);
        this.error = err.response?.data?.message || 'Failed to fetch item details';
      } finally {
        this.loading = false;
      }
    },
    processVariations(items) {
      const variationsMap = new Map();

      items.forEach(item => {
        if (item.item_variation_id) {
          if (!variationsMap.has(item.item_variation_id)) {
            variationsMap.set(item.item_variation_id, {
              item_variation_id: item.item_variation_id,
              color: item.color,
              size: item.size,
              abec_rating: item.abec_rating,
              material: item.material,
              pack_size: item.pack_size,
              bearing_type: item.bearing_type,
              quantity: item.quantity,
              old_price: item.old_price,
              current_price: item.current_price,
              discount: item.discount,
              base_image_path: item.base_image_path,
              show_on_main_page: item.show_on_main_page,
              show_as_variation: item.show_as_variation,
              images: []
            });
          }

          // Add image if present
          if (item.image_path) {
            const variation = variationsMap.get(item.item_variation_id);
            if (!variation.images.includes(item.image_path)) {
              variation.images.push(item.image_path);
            }
          }
        }
      });

      this.variations = Array.from(variationsMap.values());
    },
    async handleUpdate() {
      this.updating = true;
      this.error = null;
      this.successMessage = null;

      try {
        const { itemType, itemId } = this.$route.params;
        
        const updateData = {
          itemType,
          itemId,
          baseData: this.formData,
          variations: this.variations
        };

        // You'll need to create this endpoint on your server
        const response = await axios.put('http://localhost:3000/vsa/admin/update-item', updateData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          this.successMessage = 'Item updated successfully!';
          setTimeout(() => {
            this.successMessage = null;
          }, 5000);
        } else {
          this.error = response.data.message || 'Failed to update item';
        }
      } catch (err) {
        console.error('Error updating item:', err);
        this.error = err.response?.data?.message || 'An error occurred while updating';
      } finally {
        this.updating = false;
      }
    },
    handleImageError(e) {
      e.target.style.display = 'none';
    }
  }
};
</script>

<style scoped>
input:disabled {
  cursor: not-allowed;
}
</style>