<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-3xl font-bold text-gray-900">Edit Item</h1>
        </div>
        <button
          @click="saveChanges"
          :disabled="saving"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Content -->
      <div v-else-if="itemData.length > 0" class="space-y-8">
        <!-- Base Item Information -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">Basic Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Item ID (Read Only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Item ID</label>
              <input
                type="text"
                :value="baseItem.item_id"
                disabled
                class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                v-model="baseItem.name"
                type="text"
                maxlength="50"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Short Description -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
              <input
                v-model="baseItem.short_description"
                type="text"
                maxlength="150"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Detailed Description -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
              <textarea
                v-model="baseItem.detailed_description"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <!-- Why to Choose -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Why to Choose</label>
              <input
                v-model="baseItem.why_to_choose"
                type="text"
                maxlength="255"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Features -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <textarea
                v-model="baseItem.features"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <!-- Main Image -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Main Image Path</label>
              <input
                v-model="baseItem.main_image_path"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div v-if="baseItem.main_image_path" class="mt-3">
                <img
                  :src="baseItem.main_image_path"
                  :alt="baseItem.name"
                  class="w-48 h-48 object-cover rounded-lg border border-gray-200"
                />
              </div>
            </div>

            <!-- Average Rating (Read Only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Average Rating</label>
              <input
                type="text"
                :value="baseItem.average_rating"
                disabled
                class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            <!-- Is Shown -->
            <div class="flex items-center">
              <input
                v-model="baseItem.is_shown"
                type="checkbox"
                id="is_shown"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="is_shown" class="ml-2 text-sm font-medium text-gray-700">Show Item</label>
            </div>
          </div>
        </div>

        <!-- Variations -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">Variations</h2>
          
          <div v-for="(variation, index) in variations" :key="variation.item_variation_id" class="mb-8 pb-8 border-b border-gray-200 last:border-b-0">
            <h3 class="text-xl font-semibold text-gray-700 mb-4">Variation {{ index + 1 }}</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Variation ID (Read Only) -->
              <div class="lg:col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Variation ID</label>
                <input
                  type="text"
                  :value="variation.item_variation_id"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              <!-- Common Fields for all types except bearings -->
              <template v-if="itemName !== 'bearings'">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                  <input
                    v-model="variation.color"
                    type="text"
                    maxlength="30"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Size *</label>
                  <input
                    v-model="variation.size"
                    type="text"
                    maxlength="20"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </template>

              <!-- Bearings Specific Fields -->
              <template v-else>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ABEC Rating</label>
                  <input
                    v-model="variation.abec_rating"
                    type="text"
                    maxlength="20"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Material</label>
                  <select
                    v-model="variation.material"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Material</option>
                    <option value="Steel">Steel</option>
                    <option value="Ceramic">Ceramic</option>
                    <option value="Titanium">Titanium</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Size</label>
                  <input
                    v-model="variation.size"
                    type="text"
                    maxlength="15"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Pack Size</label>
                  <input
                    v-model.number="variation.pack_size"
                    type="number"
                    min="0"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Bearing Type</label>
                  <input
                    v-model="variation.bearing_type"
                    type="text"
                    maxlength="20"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </template>

              <!-- Common Fields -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                <input
                  v-model.number="variation.quantity"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Old Price</label>
                <input
                  v-model.number="variation.old_price"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Current Price *</label>
                <input
                  v-model.number="variation.current_price"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

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

              <!-- Base Image -->
              <div class="lg:col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Base Image Path *</label>
                <input
                  v-model="variation.base_image_path"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div v-if="variation.base_image_path" class="mt-3">
                  <img
                    :src="variation.base_image_path"
                    alt="Variation base image"
                    class="w-48 h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              </div>

              <!-- Checkboxes -->
              <div class="flex items-center">
                <input
                  v-model="variation.show_on_main_page"
                  type="checkbox"
                  :id="`show_main_${index}`"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label :for="`show_main_${index}`" class="ml-2 text-sm font-medium text-gray-700">Show on Main Page</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="variation.show_as_variation"
                  type="checkbox"
                  :id="`show_variation_${index}`"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label :for="`show_variation_${index}`" class="ml-2 text-sm font-medium text-gray-700">Show as Variation</label>
              </div>

              <!-- Variation Images -->
              <div class="lg:col-span-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                <div class="space-y-3">
                  <div v-for="(img, imgIndex) in variation.images" :key="imgIndex" class="flex items-start gap-3">
                    <input
                      v-model="img.image_path"
                      type="text"
                      placeholder="Image path"
                      class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      @click="removeVariationImage(index, imgIndex)"
                      class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    @click="addVariationImage(index)"
                    class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    + Add Image
                  </button>
                </div>
                
                <!-- Image Previews -->
                <div v-if="variation.images.length > 0" class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <div v-for="(img, imgIndex) in variation.images" :key="imgIndex">
                    <img
                      v-if="img.image_path"
                      :src="'http://localhost:3000' + img.image_path"
                      :alt="`Variation image ${imgIndex + 1}`"
                      class="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditItem',
  
  data() {
    return {
      loading: true,
      saving: false,
      error: null,
      itemName: '',
      itemId: '',
      itemData: [],
      baseItem: {},
      variations: []
    };
  },

  mounted() {
    // Get parameters from route query
    this.itemName = this.$route.query.itemName;
    this.itemId = this.$route.query.itemId;
    
    if (!this.itemName || !this.itemId) {
      this.error = 'Missing item name or ID';
      this.loading = false;
      return;
    }
    
    this.fetchItemData();
  },

  methods: {
    async fetchItemData() {
      try {
        this.loading = true;
        this.error = null;

        const response = await fetch(
          `http://localhost:3000/vsa/admin/get-single-item?itemName=${this.itemName}&itemId=${this.itemId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch item data');
        }

        if (data.success && data.item) {
          this.itemData = data.item;
          this.processItemData();
        } else {
          throw new Error('No item data found');
        }
      } catch (err) {
        console.error('Error fetching item data:', err);
        this.error = err.message || 'Failed to load item data';
      } finally {
        this.loading = false;
      }
    },

    processItemData() {
      if (this.itemData.length === 0) return;

      // Extract base item data (same across all rows)
      const firstRow = this.itemData[0];
      this.baseItem = {
        item_id: firstRow.item_id,
        name: firstRow.name,
        short_description: firstRow.short_description,
        detailed_description: firstRow.detailed_description,
        why_to_choose: firstRow.why_to_choose,
        main_image_path: 'http://localhost:3000' + firstRow.main_image_path,
        features: firstRow.features,
        average_rating: firstRow.average_rating,
        is_shown: Boolean(firstRow.is_shown)
      };

      // Group variations and their images
      const variationMap = new Map();

      this.itemData.forEach(row => {
        if (!row.item_variation_id) return;

        if (!variationMap.has(row.item_variation_id)) {
          const variation = {
            id: row.id,
            item_variation_id: row.item_variation_id,
            item_id: row.item_id,
            quantity: row.quantity,
            old_price: row.old_price,
            current_price: row.current_price,
            discount: row.discount,
            base_image_path: 'http://localhost:3000' + row.base_image_path,
            show_on_main_page: Boolean(row.show_on_main_page),
            show_as_variation: Boolean(row.show_as_variation),
            images: []
          };

          // Add type-specific fields
          if (this.itemName === 'bearings') {
            variation.abec_rating = row.abec_rating;
            variation.material = row.material;
            variation.size = row.size;
            variation.pack_size = row.pack_size;
            variation.bearing_type = row.bearing_type;
          } else {
            variation.color = row.color;
            variation.size = row.size;
          }

          variationMap.set(row.item_variation_id, variation);
        }

        // Add image if exists
        if (row.image_path) {
          variationMap.get(row.item_variation_id).images.push({
            id: row.image_id,
            image_path: row.image_path
          });
        }
      });

      this.variations = Array.from(variationMap.values());
    },

    addVariationImage(variationIndex) {
      this.variations[variationIndex].images.push({
        id: null,
        image_path: ''
      });
    },

    removeVariationImage(variationIndex, imageIndex) {
      this.variations[variationIndex].images.splice(imageIndex, 1);
    },

    async saveChanges() {
      // TODO: Implement save functionality
      console.log('Saving changes...');
      console.log('Base Item:', this.baseItem);
      console.log('Variations:', this.variations);
      
      // You'll need to create an update endpoint and call it here
      alert('Save functionality needs to be implemented with an update endpoint');
    },

    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
/* Custom styles if needed */
</style>