<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-16"></h1>

      <!-- Item Type Selection -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Item Type</label>
        <select v-model="itemType" class="w-full border border-gray-300 rounded-md px-3 py-2">
          <option value="">Select Type</option>
          <option value="skates_and_boots">Skates & Boots</option>
          <option value="wheels">Wheels</option>
          <option value="helmets">Helmets</option>
          <option value="accessories">Accessories</option>
          <option value="bearings">Bearings</option>
        </select>
      </div>

      <form @submit.prevent="handleSubmit" v-if="itemType">
        <!-- Basic Information -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input v-model="formData.name" type="text" required 
                class="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <input v-model="formData.shortDescription" type="text" 
                class="w-full border border-gray-300 rounded-md px-3 py-2" 
                maxlength="150" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
              <textarea v-model="formData.detailedDescription" rows="4"
                class="w-full border border-gray-300 rounded-md px-3 py-2"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Main Image *</label>
              <input type="file" @change="handleMainImage" accept="image/*" required
                class="w-full border border-gray-300 rounded-md px-3 py-2" />
              <p v-if="mainImagePreview" class="mt-2 text-sm text-gray-500">
                Selected: {{ mainImagePreview }}
              </p>
            </div>

            <div>
              <label class="flex items-center">
                <input type="checkbox" v-model="formData.isShown" class="mr-2" />
                <span class="text-sm text-gray-700">Show Item</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Why To Choose (Only for non-bearings) -->
        <div v-if="itemType !== 'bearings'" class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Why To Choose</h2>
          <div class="space-y-2">
            <div v-for="(reason, index) in formData.whyToChoose" :key="index" class="flex gap-2">
              <input v-model="formData.whyToChoose[index]" type="text"
                class="flex-1 border border-gray-300 rounded-md px-3 py-2" 
                placeholder="Enter reason" />
              <button type="button" @click="removeWhy(index)"
                class="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Remove
              </button>
            </div>
            <button type="button" @click="addWhy"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Add Reason
            </button>
          </div>
        </div>

        <!-- Why To Choose (For bearings - single field) -->
        <div v-else class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Why To Choose</h2>
          <input v-model="formData.whyToChooseSingle" type="text"
            class="w-full border border-gray-300 rounded-md px-3 py-2" 
            maxlength="255"
            placeholder="Enter why to choose this bearing" />
        </div>

        <!-- Features -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Features</h2>
          <div class="space-y-2">
            <div v-for="(feature, index) in formData.features" :key="index" class="flex gap-2">
              <input v-model="formData.features[index]" type="text"
                class="flex-1 border border-gray-300 rounded-md px-3 py-2" 
                placeholder="Enter feature" />
              <button type="button" @click="removeFeature(index)"
                class="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Remove
              </button>
            </div>
            <button type="button" @click="addFeature"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Add Feature
            </button>
          </div>
        </div>

        <!-- Variations -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Variations</h2>
          
          <div v-for="(variation, vIndex) in formData.variationData" :key="vIndex" 
            class="border border-gray-200 rounded-md p-4 mb-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-medium text-gray-900">Variation {{ vIndex + 1 }}</h3>
              <button type="button" @click="removeVariation(vIndex)"
                class="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">
                Remove
              </button>
            </div>

            <!-- Regular Items (Skates, Wheels, etc) -->
            <div v-if="itemType !== 'bearings'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-700 mb-1">Color *</label>
                <input v-model="variation.color" type="text" required
                  class="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Size *</label>
                <input v-model="variation.size" type="text" required
                  class="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Quantity *</label>
                <input v-model.number="variation.quantity" type="number" required min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Current Price *</label>
                <input v-model.number="variation.currentPrice" type="number" required min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Old Price</label>
                <input v-model.number="variation.oldPrice" type="number" min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Discount (%)</label>
                <input v-model.number="variation.discount" type="number" min="0" max="100"
                  class="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
            </div>

            <!-- Bearings -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-700 mb-1">ABEC Rating</label>
                <input v-model="variation.abecRating" type="text"
                  placeholder="e.g., ABEC-7"
                  class="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Material *</label>
                <select v-model="variation.material" required
                  class="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="">Select</option>
                  <option value="Steel">Steel</option>
                  <option value="Ceramic">Ceramic</option>
                  <option value="Titanium">Titanium</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Size *</label>
                <input v-model="variation.size" type="text" required
                  class="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Pack Size</label>
                <input v-model.number="variation.packSize" type="number" min="1"
                  placeholder="e.g., 8, 16"
                  class="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Bearing Type</label>
                <input v-model="variation.bearingType" type="text"
                  placeholder="e.g., 608RS"
                  class="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Quantity *</label>
                <input v-model.number="variation.quantity" type="number" required min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Current Price *</label>
                <input v-model.number="variation.currentPrice" type="number" required min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Old Price</label>
                <input v-model.number="variation.oldPrice" type="number" min="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm text-gray-700 mb-1">Discount (%)</label>
                <input v-model.number="variation.discount" type="number" min="0" max="100"
                  class="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
            </div>

            <!-- Common Fields -->
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-sm text-gray-700 mb-1">Base Image *</label>
                <input type="file" @change="(e) => handleBaseImage(e, vIndex)" accept="image/*" required
                  class="w-full border border-gray-300 rounded-md px-3 py-2" />
                <p v-if="variation.baseImagePreview" class="mt-1 text-sm text-gray-500">
                  Selected: {{ variation.baseImagePreview }}
                </p>
              </div>

              <div class="flex gap-4">
                <label class="flex items-center">
                  <input type="checkbox" v-model="variation.showOnMainPage" class="mr-2" />
                  <span class="text-sm text-gray-700">Show on Main Page</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" v-model="variation.showAsVariation" class="mr-2" />
                  <span class="text-sm text-gray-700">Show as Variation</span>
                </label>
              </div>

              <!-- Variation Images -->
              <div>
                <label class="block text-sm text-gray-700 mb-2">Variation Images</label>
                <div class="space-y-2">
                  <div v-for="(img, imgIndex) in variation.variationImagesFiles" :key="imgIndex" class="flex gap-2 items-center">
                    <input type="file" @change="(e) => handleVariationImage(e, vIndex, imgIndex)" accept="image/*"
                      class="flex-1 border border-gray-300 rounded-md px-3 py-2" />
                    <button type="button" @click="removeVariationImageFile(vIndex, imgIndex)"
                      class="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                      Remove
                    </button>
                  </div>
                  <button type="button" @click="addVariationImageFile(vIndex)"
                    class="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">
                    Add Image
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button type="button" @click="addVariation"
            class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Add Variation
          </button>
        </div>

        <!-- Submit Button -->
        <div class="flex gap-4">
          <button type="submit" :disabled="loading"
            class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400">
            {{ loading ? 'Submitting...' : 'Add Item' }}
          </button>
          <button type="button" @click="resetForm"
            class="px-6 py-3 bg-gray-500 text-white rounded-md font-medium hover:bg-gray-600">
            Reset
          </button>
        </div>
      </form>

      <!-- Success/Error Messages -->
      <div v-if="message" :class="[
        'mt-4 p-4 rounded-md',
        messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      ]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddNewItem',
  data() {
    return {
      itemType: '',
      loading: false,
      message: '',
      messageType: '',
      mainImageFile: null,
      mainImagePreview: '',
      formData: {
        name: '',
        shortDescription: '',
        detailedDescription: '',
        whyToChoose: [''],
        whyToChooseSingle: '',
        features: [''],
        isShown: true,
        variationData: []
      }
    }
  },
  watch: {
    itemType() {
      this.resetForm();
    }
  },
  methods: {
    handleMainImage(event) {
      const file = event.target.files[0];
      if (file) {
        this.mainImageFile = file;
        this.mainImagePreview = file.name;
      }
    },
    handleBaseImage(event, vIndex) {
      const file = event.target.files[0];
      if (file) {
        this.formData.variationData[vIndex].baseImageFile = file;
        this.formData.variationData[vIndex].baseImagePreview = file.name;
      }
    },
    handleVariationImage(event, vIndex, imgIndex) {
      const file = event.target.files[0];
      if (file) {
        this.formData.variationData[vIndex].variationImagesFiles[imgIndex].file = file;
        this.formData.variationData[vIndex].variationImagesFiles[imgIndex].preview = file.name;
      }
    },
    addWhy() {
      this.formData.whyToChoose.push('');
    },
    removeWhy(index) {
      this.formData.whyToChoose.splice(index, 1);
    },
    addFeature() {
      this.formData.features.push('');
    },
    removeFeature(index) {
      this.formData.features.splice(index, 1);
    },
    addVariation() {
      const baseVariation = {
        quantity: 0,
        currentPrice: 0,
        oldPrice: null,
        discount: 0,
        baseImageFile: null,
        baseImagePreview: '',
        showOnMainPage: false,
        showAsVariation: true,
        variationImagesFiles: []
      };

      if (this.itemType === 'bearings') {
        this.formData.variationData.push({
          ...baseVariation,
          abecRating: '',
          material: '',
          size : '',
          packSize: null,
          bearingType: ''
        });
      } else {
        this.formData.variationData.push({
          ...baseVariation,
          color: '',
          size: ''
        });
      }
    },
    removeVariation(index) {
      this.formData.variationData.splice(index, 1);
    },
    addVariationImageFile(vIndex) {
      this.formData.variationData[vIndex].variationImagesFiles.push({
        file: null,
        preview: ''
      });
    },
    removeVariationImageFile(vIndex, imgIndex) {
      this.formData.variationData[vIndex].variationImagesFiles.splice(imgIndex, 1);
    },
    async handleSubmit() {
      this.loading = true;
      this.message = '';

      try {
        const formDataToSend = new FormData();
        
        // Prepare itemData object
        const itemData = {
          name: this.formData.name,
          shortDescription: this.formData.shortDescription,
          detailedDescription: this.formData.detailedDescription,
          features: this.formData.features.filter(f => f.trim()),
          isShown: this.formData.isShown,
          variationData: []
        };

        if (this.itemType !== 'bearings') {
          itemData.itemType = this.itemType;
          itemData.whyToChoose = this.formData.whyToChoose.filter(w => w.trim());
        } else {
          itemData.whyToChoose = this.formData.whyToChooseSingle;
        }

        // Process variations data (without files)
        this.formData.variationData.forEach((variation) => {
          const varData = {
            quantity: variation.quantity,
            currentPrice: variation.currentPrice,
            oldPrice: variation.oldPrice,
            discount: variation.discount,
            showOnMainPage: variation.showOnMainPage,
            showAsVariation: variation.showAsVariation,
            variationImages: [] // Will be empty as we're uploading files
          };

          if (this.itemType === 'bearings') {
            varData.abecRating = variation.abecRating;
            varData.material = variation.material;
            varData.size = variation.size;
            varData.packSize = variation.packSize;
            varData.bearingType = variation.bearingType;
          } else {
            varData.color = variation.color;
            varData.size = variation.size;
          }

          itemData.variationData.push(varData);
        });

        formDataToSend.append('itemData', JSON.stringify(itemData));

        // Add main image
        if (this.mainImageFile) {
          formDataToSend.append('mainImage', this.mainImageFile);
        }

        // Add base images and variation images for each variation
        this.formData.variationData.forEach((variation, vIndex) => {
          // Add base image
          if (variation.baseImageFile) {
            formDataToSend.append(`baseImage_${vIndex}`, variation.baseImageFile);
          }

          // Add variation images
          variation.variationImagesFiles.forEach((imgObj, imgIndex) => {
            if (imgObj.file) {
              formDataToSend.append(`variationImage_${vIndex}_${imgIndex}`, imgObj.file);
            }
          });
        });

        // Determine endpoint
        const endpoint = this.itemType === 'bearings' 
          ? 'http://localhost:3000/vsa/admin/add-new-bearing' 
          : 'http://localhost:3000/vsa/admin/add-new-item';

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formDataToSend
        });

        const result = await response.json();

        if (result.success) {
          this.message = result.message;
          this.messageType = 'success';
          this.resetForm();
        } else {
          this.message = result.message || 'Failed to add item';
          this.messageType = 'error';
        }
      } catch (error) {
        this.message = 'Error: ' + error.message;
        this.messageType = 'error';
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.formData = {
        name: '',
        shortDescription: '',
        detailedDescription: '',
        whyToChoose: [''],
        whyToChooseSingle: '',
        features: [''],
        isShown: true,
        variationData: []
      };
      this.mainImageFile = null;
      this.mainImagePreview = '';
      this.message = '';
    }
  }
}
</script>

<style scoped>
input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>