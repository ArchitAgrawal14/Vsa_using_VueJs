<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between mt-12">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-3xl font-bold text-gray-900">Edit {{ itemName === 'bearings' ? 'Bearing' : 'Item' }}</h1>
        </div>
        <div class="flex gap-3">
          <button
            @click="confirmDelete"
            :disabled="saving || deleting"
            class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
          <button
            @click="saveChanges"
            :disabled="saving || deleting"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p class="text-green-800">{{ successMessage }}</p>
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
              <textarea
                v-model="baseItem.why_to_choose"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <!-- Features -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Features (JSON Array)</label>
              <textarea
                v-model="baseItem.features"
                rows="3"
                placeholder='["Feature 1", "Feature 2"]'
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">Enter as JSON array format</p>
            </div>

            <!-- Main Image -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
              <div class="space-y-2">
                <input
                  type="file"
                  @change="handleMainImageUpload"
                  accept="image/*"
                  ref="mainImageInput"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  v-model="baseItem.main_image_path"
                  type="text"
                  placeholder="Or paste image URL"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div v-if="baseItem.main_image_path" class="mt-3">
                <img
                  :src="getFullImagePath(baseItem.main_image_path)"
                  :alt="baseItem.name"
                  class="w-48 h-48 object-cover rounded-lg border border-gray-200"
                  @error="handleImageError"
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
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-gray-800">Variations</h2>
            <button
              @click="addNewVariation"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + Add Variation
            </button>
          </div>
          
          <div v-for="(variation, index) in variations" :key="variation.item_variation_id || `new-${index}`" class="mb-8 pb-8 border-b border-gray-200 last:border-b-0">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold text-gray-700">Variation {{ index + 1 }}</h3>
              <button
                @click="removeVariation(index)"
                class="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove Variation
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- Variation ID (Read Only for existing) -->
              <div class="lg:col-span-3" v-if="variation.item_variation_id">
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">Color Code (Hex) *</label>
                  <input
                    v-model="variation.colorCode"
                    type="text"
                    maxlength="7"
                    placeholder="RRGGBB"
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
                    v-model="variation.abecRating"
                    type="text"
                    maxlength="20"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Material *</label>
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">Size *</label>
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
                    v-model.number="variation.packSize"
                    type="number"
                    min="0"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Bearing Type</label>
                  <input
                    v-model="variation.bearingType"
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
                  v-model.number="variation.oldPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Current Price *</label>
                <input
                  v-model.number="variation.currentPrice"
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
                <label class="block text-sm font-medium text-gray-700 mb-2">Base Image *</label>
                <div class="space-y-2">
                  <input
                    type="file"
                    @change="(e) => handleBaseImageUpload(e, index)"
                    accept="image/*"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    v-model="variation.baseImage"
                    type="text"
                    placeholder="Or paste image URL"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div v-if="variation.baseImage" class="mt-3">
                  <img
                    :src="getFullImagePath(variation.baseImage)"
                    alt="Variation base image"
                    class="w-48 h-48 object-cover rounded-lg border border-gray-200"
                    @error="handleImageError"
                  />
                </div>
              </div>

              <!-- Checkboxes -->
              <div class="flex items-center">
                <input
                  v-model="variation.showOnMainPage"
                  type="checkbox"
                  :id="`show_main_${index}`"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label :for="`show_main_${index}`" class="ml-2 text-sm font-medium text-gray-700">Show on Main Page</label>
              </div>

              <div class="flex items-center">
                <input
                  v-model="variation.showAsVariation"
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
                  <div v-for="(img, imgIndex) in variation.variationImages" :key="imgIndex" class="flex items-start gap-3">
                    <div class="flex-1 space-y-2">
                      <input
                        type="file"
                        @change="(e) => handleVariationImageUpload(e, index, imgIndex)"
                        accept="image/*"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        v-model="variation.variationImages[imgIndex]"
                        type="text"
                        placeholder="Or paste image URL"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
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
                <div v-if="variation.variationImages.length > 0" class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <div v-for="(img, imgIndex) in variation.variationImages" :key="imgIndex">
                    <img
                      v-if="img"
                      :src="getFullImagePath(img)"
                      :alt="`Variation image ${imgIndex + 1}`"
                      class="w-full h-32 object-cover rounded-lg border border-gray-200"
                      @error="handleImageError"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "{{ baseItem.name }}"? This action will soft delete the item and it won't be shown to users.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="deleteItem"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
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
      deleting: false,
      error: null,
      successMessage: null,
      itemName: '',
      itemId: '',
      itemData: [],
      baseItem: {},
      variations: [],
      uploadedFiles: [],
      showDeleteModal: false
    };
  },

  mounted() {
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

      const firstRow = this.itemData[0];
      this.baseItem = {
        item_id: firstRow.item_id,
        name: firstRow.name,
        short_description: firstRow.short_description,
        detailed_description: firstRow.detailed_description,
        why_to_choose: firstRow.why_to_choose,
        main_image_path: firstRow.main_image_path,
        features: typeof firstRow.features === 'string' ? firstRow.features : JSON.stringify(firstRow.features),
        average_rating: firstRow.average_rating,
        is_shown: Boolean(firstRow.is_shown)
      };

      const variationMap = new Map();

      this.itemData.forEach(row => {
        if (!row.item_variation_id) return;

        if (!variationMap.has(row.item_variation_id)) {
          const variation = {
            id: row.id,
            item_variation_id: row.item_variation_id,
            item_id: row.item_id,
            quantity: row.quantity,
            oldPrice: row.old_price,
            currentPrice: row.current_price,
            discount: row.discount,
            baseImage: row.base_image_path,
            showOnMainPage: Boolean(row.show_on_main_page),
            showAsVariation: Boolean(row.show_as_variation),
            variationImages: []
          };

          if (this.itemName === 'bearings') {
            variation.abecRating = row.abec_rating;
            variation.material = row.material;
            variation.size = row.size;
            variation.packSize = row.pack_size;
            variation.bearingType = row.bearing_type;
          } else {
            variation.color = row.color;
            variation.size = row.size;
            variation.colorCode = this.extractColorCode(row.item_variation_id);
          }

          variationMap.set(row.item_variation_id, variation);
        }

        if (row.image_path) {
          variationMap.get(row.item_variation_id).variationImages.push(row.image_path);
        }
      });

      this.variations = Array.from(variationMap.values());
    },

    extractColorCode(variationId) {
      const parts = variationId.split('-');
      return parts.length > 1 ? `${parts[1]}` : '000000';
    },

    getFullImagePath(path) {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      if (path.startsWith('/')) return `http://localhost:3000${path}`;
      return `http://localhost:3000/${path}`;
    },

    handleImageError(e) {
      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
    },

    handleMainImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedFiles.push({ field: 'mainImage', file });
        this.baseItem.main_image_path = URL.createObjectURL(file);
      }
    },

    handleBaseImageUpload(event, variationIndex) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedFiles.push({ field: `baseImage_${variationIndex}`, file });
        this.variations[variationIndex].baseImage = URL.createObjectURL(file);
      }
    },

    handleVariationImageUpload(event, variationIndex, imageIndex) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedFiles.push({ 
          field: `variationImage_${variationIndex}_${imageIndex}`, 
          file 
        });
        this.variations[variationIndex].variationImages[imageIndex] = URL.createObjectURL(file);
      }
    },

    addVariationImage(variationIndex) {
      this.variations[variationIndex].variationImages.push('');
    },

    removeVariationImage(variationIndex, imageIndex) {
      this.variations[variationIndex].variationImages.splice(imageIndex, 1);
    },

    addNewVariation() {
      const newVariation = {
        item_variation_id: null,
        item_id: this.baseItem.item_id,
        quantity: 0,
        oldPrice: null,
        currentPrice: 0,
        discount: 0,
        baseImage: '',
        showOnMainPage: false,
        showAsVariation: true,
        variationImages: []
      };

      if (this.itemName === 'bearings') {
        newVariation.abecRating = '';
        newVariation.material = 'Steel';
        newVariation.size = '';
        newVariation.packSize = 8;
        newVariation.bearingType = '';
      } else {
        newVariation.color = '';
        newVariation.colorCode = '000000';
        newVariation.size = '';
      }

      this.variations.push(newVariation);
    },

    removeVariation(index) {
      if (confirm('Are you sure you want to remove this variation?')) {
        this.variations.splice(index, 1);
      }
    },

    async saveChanges() {
      try {
        this.saving = true;
        this.error = null;
        this.successMessage = null;

        // Validate required fields
        if (!this.baseItem.name || !this.baseItem.name.trim()) {
          throw new Error('Item name is required');
        }

        if (this.variations.length === 0) {
          throw new Error('At least one variation is required');
        }

        // Prepare FormData
        const formData = new FormData();

        // Prepare item data
        const itemData = {
          itemId: this.baseItem.item_id,
          name: this.baseItem.name.trim(),
          shortDescription: this.baseItem.short_description || '',
          detailedDescription: this.baseItem.detailed_description || '',
          whyToChoose: this.parseWhyToChoose(this.baseItem.why_to_choose),
          mainImagePath: this.cleanImagePath(this.baseItem.main_image_path),
          features: this.parseFeatures(this.baseItem.features),
          isShown: this.baseItem.is_shown,
          variationData: this.prepareVariationData()
        };

        // Add itemType for non-bearing items
        if (this.itemName !== 'bearings') {
          itemData.itemType = this.itemName;
        }

        // Append itemData as JSON string
        formData.append('itemData', JSON.stringify(itemData));

        // Append uploaded files
        this.uploadedFiles.forEach(({ field, file }) => {
          formData.append(field, file);
        });

        // Determine endpoint
        const endpoint = this.itemName === 'bearings' 
          ? 'http://localhost:3000/vsa/admin/edit-bearing'
          : 'http://localhost:3000/vsa/admin/edit-item';

        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update item');
        }

        this.successMessage = data.message || 'Item updated successfully!';
        this.uploadedFiles = [];
        
        // Refresh data after save
        setTimeout(() => {
          this.fetchItemData();
        }, 1500);

      } catch (err) {
        console.error('Error saving changes:', err);
        this.error = err.message || 'Failed to save changes';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } finally {
        this.saving = false;
      }
    },

    prepareVariationData() {
      return this.variations.map(v => {
        const baseData = {
          quantity: v.quantity || 0,
          currentPrice: v.currentPrice || 0,
          oldPrice: v.oldPrice || null,
          discount: v.discount || 0,
          baseImage: this.cleanImagePath(v.baseImage),
          showOnMainPage: v.showOnMainPage || false,
          showAsVariation: v.showAsVariation || false,
          variationImages: v.variationImages.filter(img => img && img.trim()).map(img => this.cleanImagePath(img))
        };

        if (this.itemName === 'bearings') {
          return {
            ...baseData,
            abecRating: v.abecRating || null,
            material: v.material || 'Steel',
            size: v.size || '',
            packSize: v.packSize || null,
            bearingType: v.bearingType || null
          };
        } else {
          return {
            ...baseData,
            color: v.color || '',
            colorCode: v.colorCode || '000000',
            size: v.size || ''
          };
        }
      });
    },

    cleanImagePath(path) {
      if (!path) return null;
      if (path.startsWith('blob:')) return null; // Uploaded file, will be handled separately
      if (path.startsWith('http://localhost:3000')) {
        return path.replace('http://localhost:3000', '');
      }
      if (path.startsWith('http')) return path;
      return path;
    },

    parseFeatures(features) {
      try {
        if (typeof features === 'string') {
          return JSON.parse(features);
        }
        return features || [];
      } catch (e) {
        console.error('Error parsing features:', e);
        return [];
      }
    },

    parseWhyToChoose(whyToChoose) {
      try {
        if (typeof whyToChoose === 'string') {
          // Try to parse as JSON first
          if (whyToChoose.trim().startsWith('[') || whyToChoose.trim().startsWith('{')) {
            return JSON.parse(whyToChoose);
          }
        }
        return whyToChoose || '';
      } catch (e) {
        return whyToChoose || '';
      }
    },

    confirmDelete() {
      this.showDeleteModal = true;
    },

    async deleteItem() {
      try {
        this.deleting = true;
        this.error = null;
        this.showDeleteModal = false;

        const endpoint = this.itemName === 'bearings'
          ? 'http://localhost:3000/vsa/admin/delete-bearing'
          : 'http://localhost:3000/vsa/admin/delete-item';

        const body = this.itemName === 'bearings'
          ? { itemId: this.baseItem.item_id }
          : { itemId: this.baseItem.item_id, itemType: this.itemName };

        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete item');
        }

        this.successMessage = data.message || 'Item deleted successfully!';
        
        // Redirect back after short delay
        setTimeout(() => {
          this.goBack();
        }, 2000);

      } catch (err) {
        console.error('Error deleting item:', err);
        this.error = err.message || 'Failed to delete item';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } finally {
        this.deleting = false;
      }
    },

    goBack() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
/* Custom styles if needed */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  opacity: 1;
}
</style>