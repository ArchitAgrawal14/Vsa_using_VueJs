<template>
  <div class="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-6 mt-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Academy Achievements</h1>
            <p class="text-sm text-gray-600 mt-1">Manage academy achievements, medals, and competitions</p>
          </div>
          <button
            @click="openAddModal"
            class="w-full sm:w-auto bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            + Add Achievement
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white shadow-sm rounded-lg p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <p class="mt-4 text-gray-600">Loading achievements...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Achievements Grid -->
      <div v-else-if="achievements.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div
          v-for="achievement in achievements"
          :key="achievement.id"
          class="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <!-- Banner Image -->
          <div class="relative h-48 bg-gray-200">
            <img
              v-if="achievement.banner_image"
              :src="`http://localhost:3000${achievement.banner_image}`"
              :alt="achievement.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-400">
              <span class="text-4xl">🏆</span>
            </div>
            <!-- Image count badge -->
            <div v-if="achievement.images && achievement.images.length > 0" 
                 class="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-full text-xs">
              {{ achievement.images.length }} photos
            </div>
          </div>

          <!-- Content -->
          <div class="p-4 sm:p-5">
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{{ achievement.title }}</h3>
            
            <div class="space-y-2 mb-4">
              <div v-if="achievement.competition_name" class="flex items-center text-sm text-gray-600">
                <span class="font-medium mr-2">Competition:</span>
                <span>{{ achievement.competition_name }}</span>
              </div>
              
              <div v-if="achievement.competition_category" class="flex items-center text-sm">
                <span class="px-2 py-1 bg-gray-100 rounded text-gray-700 text-xs">
                  {{ achievement.competition_category }}
                </span>
                <span v-if="achievement.competition_level" class="ml-2 px-2 py-1 bg-gray-100 rounded text-gray-700 text-xs">
                  {{ achievement.competition_level }}
                </span>
              </div>
              
              <div v-if="achievement.event_date" class="text-sm text-gray-600">
                <span class="font-medium">Date:</span> {{ formatDate(achievement.event_date) }}
              </div>
              
              <div v-if="achievement.location" class="text-sm text-gray-600">
                <span class="font-medium">Location:</span> {{ achievement.location }}
              </div>

              <!-- Medals Display -->
              <div v-if="achievement.total_medals_won > 0" class="flex flex-wrap gap-2 pt-2">
                <div v-if="achievement.gold_medals > 0" class="flex items-center bg-yellow-50 px-2 py-1 rounded">
                  <span class="text-yellow-600 mr-1">🥇</span>
                  <span class="text-sm font-medium text-yellow-800">{{ achievement.gold_medals }}</span>
                </div>
                <div v-if="achievement.silver_medals > 0" class="flex items-center bg-gray-50 px-2 py-1 rounded">
                  <span class="text-gray-600 mr-1">🥈</span>
                  <span class="text-sm font-medium text-gray-800">{{ achievement.silver_medals }}</span>
                </div>
                <div v-if="achievement.bronze_medals > 0" class="flex items-center bg-orange-50 px-2 py-1 rounded">
                  <span class="text-orange-600 mr-1">🥉</span>
                  <span class="text-sm font-medium text-orange-800">{{ achievement.bronze_medals }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 pt-3 border-t border-gray-100">
              <button
                @click="openViewModal(achievement)"
                class="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                View
              </button>
              <button
                @click="openEditModal(achievement)"
                class="flex-1 bg-black text-white px-3 py-2 rounded hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(achievement.id)"
                class="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white shadow-sm rounded-lg p-12 text-center">
        <span class="text-6xl mb-4 block">🏆</span>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Achievements Yet</h3>
        <p class="text-gray-600 mb-6">Start by adding your first academy achievement</p>
        <button
          @click="openAddModal"
          class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          Add First Achievement
        </button>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]" @click.self="closeViewModal">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Achievement Details</h2>
          <button @click="closeViewModal" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <div class="p-4 sm:p-6">
          <div v-if="selectedAchievement.banner_image" class="mb-6">
            <img
              :src="`http://localhost:3000${selectedAchievement.banner_image}`"
              :alt="selectedAchievement.title"
              class="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ selectedAchievement.title }}</h3>
          
          <div v-if="selectedAchievement.description" class="mb-6">
            <h4 class="font-semibold text-gray-900 mb-2">Description</h4>
            <p class="text-gray-700 whitespace-pre-wrap">{{ selectedAchievement.description }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div v-if="selectedAchievement.competition_name">
              <h4 class="font-semibold text-gray-900 mb-1">Competition</h4>
              <p class="text-gray-700">{{ selectedAchievement.competition_name }}</p>
            </div>
            <div v-if="selectedAchievement.competition_category">
              <h4 class="font-semibold text-gray-900 mb-1">Category</h4>
              <p class="text-gray-700">{{ selectedAchievement.competition_category }}</p>
            </div>
            <div v-if="selectedAchievement.competition_level">
              <h4 class="font-semibold text-gray-900 mb-1">Level</h4>
              <p class="text-gray-700">{{ selectedAchievement.competition_level }}</p>
            </div>
            <div v-if="selectedAchievement.event_date">
              <h4 class="font-semibold text-gray-900 mb-1">Date</h4>
              <p class="text-gray-700">{{ formatDate(selectedAchievement.event_date) }}</p>
            </div>
            <div v-if="selectedAchievement.location">
              <h4 class="font-semibold text-gray-900 mb-1">Location</h4>
              <p class="text-gray-700">{{ selectedAchievement.location }}</p>
            </div>
          </div>

          <div v-if="selectedAchievement.total_medals_won > 0" class="mb-6">
            <h4 class="font-semibold text-gray-900 mb-3">Medals Won</h4>
            <div class="flex flex-wrap gap-4">
              <div v-if="selectedAchievement.gold_medals > 0" class="flex items-center bg-yellow-50 px-4 py-3 rounded-lg">
                <span class="text-3xl mr-3">🥇</span>
                <div>
                  <p class="text-sm text-gray-600">Gold</p>
                  <p class="text-2xl font-bold text-yellow-800">{{ selectedAchievement.gold_medals }}</p>
                </div>
              </div>
              <div v-if="selectedAchievement.silver_medals > 0" class="flex items-center bg-gray-50 px-4 py-3 rounded-lg">
                <span class="text-3xl mr-3">🥈</span>
                <div>
                  <p class="text-sm text-gray-600">Silver</p>
                  <p class="text-2xl font-bold text-gray-800">{{ selectedAchievement.silver_medals }}</p>
                </div>
              </div>
              <div v-if="selectedAchievement.bronze_medals > 0" class="flex items-center bg-orange-50 px-4 py-3 rounded-lg">
                <span class="text-3xl mr-3">🥉</span>
                <div>
                  <p class="text-sm text-gray-600">Bronze</p>
                  <p class="text-2xl font-bold text-orange-800">{{ selectedAchievement.bronze_medals }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedAchievement.images && selectedAchievement.images.length > 0" class="mb-6">
            <h4 class="font-semibold text-gray-900 mb-3">Additional Images</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <img
                v-for="(image, index) in selectedAchievement.images"
                :key="index"
                :src="`http://localhost:3000${image}`"
                :alt="`Image ${index + 1}`"
                class="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                @click="openImageViewer(image)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]" @click.self="closeAddEditModal">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center rounded-t-lg">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900">
            {{ isEditMode ? 'Edit Achievement' : 'Add Achievement' }}
          </h2>
          <button @click="closeAddEditModal" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <form @submit.prevent="submitForm" class="p-4 sm:p-6 space-y-6">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">Title *</label>
            <input
              v-model="formData.title"
              type="text"
              required
              maxlength="100"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter achievement title"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">Description</label>
            <textarea
              v-model="formData.description"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter achievement description"
            ></textarea>
          </div>

          <!-- Competition Details -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">Competition Name</label>
              <input
                v-model="formData.competition_name"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter competition name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">Event Date</label>
              <input
                v-model="formData.event_date"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          <!-- Category and Level -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">Category</label>
              <select
                v-model="formData.competition_category"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Select category</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-900 mb-2">Level</label>
              <select
                v-model="formData.competition_level"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Select level</option>
                <option v-for="level in levels" :key="level" :value="level">{{ level }}</option>
              </select>
            </div>
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">Location</label>
            <input
              v-model="formData.location"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter location"
            />
          </div>

          <!-- Medals -->
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-3">Medals Won</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label class="block text-xs text-gray-600 mb-1">Total</label>
                <input
                  v-model.number="formData.total_medals_won"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">🥇 Gold</label>
                <input
                  v-model.number="formData.gold_medals"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">🥈 Silver</label>
                <input
                  v-model.number="formData.silver_medals"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">🥉 Bronze</label>
                <input
                  v-model.number="formData.bronze_medals"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <!-- Banner Image -->
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">Banner Image</label>
            <div class="flex items-center gap-4">
              <label class="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                <span>{{ formData.banner_image_file ? 'Change Banner' : 'Upload Banner' }}</span>
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleBannerUpload"
                />
              </label>
              <span v-if="formData.banner_image_file" class="text-sm text-gray-600">
                {{ formData.banner_image_file.name }}
              </span>
            </div>
            <div v-if="formData.banner_image_preview || (isEditMode && selectedAchievement.banner_image)" class="mt-3">
              <img
                :src="formData.banner_image_preview || `http://localhost:3000${selectedAchievement.banner_image}`"
                alt="Banner preview"
                class="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>

          <!-- Additional Images -->
          <div>
            <label class="block text-sm font-medium text-gray-900 mb-2">Additional Images</label>
            <label class="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-block">
              <span>Upload Images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="handleAdditionalImagesUpload"
              />
            </label>
            
            <!-- New images preview -->
            <div v-if="formData.additional_images.length > 0" class="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
              <div v-for="(img, index) in formData.additional_images" :key="'new-' + index" class="relative">
                <img :src="img.preview" alt="New image" class="w-full h-24 object-cover rounded-lg" />
                <button
                  type="button"
                  @click="removeNewImage(index)"
                  class="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                >
                  &times;
                </button>
              </div>
            </div>

            <!-- Existing images (edit mode) -->
            <div v-if="isEditMode && existingImages.length > 0" class="mt-3">
              <p class="text-sm text-gray-600 mb-2">Existing Images</p>
              <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <div v-for="img in existingImages" :key="img.id" class="relative">
                  <img :src="`http://localhost:3000${img.images_url}`" alt="Existing image" class="w-full h-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    @click="markImageForDeletion(img.images_url)"
                    :class="[
                      'absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center',
                      formData.delete_image_ids.includes(img.images_url) 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    ]"
                  >
                    {{ formData.delete_image_ids.includes(img.images_url) ? '✓' : '&times;' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="closeAddEditModal"
              class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex-1 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Saving...' : (isEditMode ? 'Update Achievement' : 'Add Achievement') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <div v-if="showImageViewer" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50" @click="closeImageViewer">
      <div class="max-w-5xl max-h-[90vh] relative">
        <button @click="closeImageViewer" class="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300">&times;</button>
        <img :src="`http://localhost:3000${viewerImage}`" alt="Full size" class="max-w-full max-h-[90vh] object-contain" />
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
        <p class="text-gray-700 mb-6">Are you sure you want to delete this achievement? This action cannot be undone and will delete all associated images.</p>
        <div class="flex gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="deleteAchievement"
            :disabled="deleting"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" :class="[
      'fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transition-all transform',
      toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    ]">
      {{ toast.message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ManageAcademyAchievement',
  data() {
    return {
      baseUrl: 'http://localhost:3000',
      loading: false,
      submitting: false,
      deleting: false,
      error: null,
      achievements: [],
      selectedAchievement: null,
      showViewModal: false,
      showAddEditModal: false,
      showDeleteConfirm: false,
      showImageViewer: false,
      viewerImage: null,
      isEditMode: false,
      deleteId: null,
      existingImages: [],
      
      categories: ['Roller Speed Skating', 'Roll Ball', 'Ice Skating', 'Record', 'Camp'],
      levels: ['school', 'block', 'district', 'division', 'state', 'national', 'international', 'record', 'RSFI', 'SGFI'],
      
      formData: {
        title: '',
        description: '',
        competition_name: '',
        event_date: '',
        competition_category: '',
        competition_level: '',
        location: '',
        total_medals_won: 0,
        gold_medals: 0,
        silver_medals: 0,
        bronze_medals: 0,
        banner_image_file: null,
        banner_image_preview: null,
        additional_images: [],
        delete_image_ids: []
      },
      
      toast: {
        show: false,
        message: '',
        type: 'success'
      }
    };
  },
  
  mounted() {
    this.fetchAchievements();
  },
  
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('token');
      return {
        'Authorization': `Bearer ${token}`
      };
    },
    
    async fetchAchievements() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(`${this.baseUrl}/vsa/admin/academy-achievements`, {
          headers: this.getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (data.success) {
          this.achievements = data.academyAchievements;
        } else {
          this.error = data.message || 'Failed to fetch achievements';
        }
      } catch (err) {
        this.error = 'Failed to connect to server';
        console.error('Fetch error:', err);
      } finally {
        this.loading = false;
      }
    },
    
    openAddModal() {
      this.isEditMode = false;
      this.resetForm();
      this.showAddEditModal = true;
    },
    
    openEditModal(achievement) {
      this.isEditMode = true;
      this.selectedAchievement = achievement;
      this.existingImages = achievement.images ? achievement.images.map((url, idx) => ({
        id: idx,
        images_url: url
      })) : [];
      
      this.formData = {
        title: achievement.title || '',
        description: achievement.description || '',
        competition_name: achievement.competition_name || '',
        event_date: achievement.event_date ? achievement.event_date.split('T')[0] : '',
        competition_category: achievement.competition_category || '',
        competition_level: achievement.competition_level || '',
        location: achievement.location || '',
        total_medals_won: achievement.total_medals_won || 0,
        gold_medals: achievement.gold_medals || 0,
        silver_medals: achievement.silver_medals || 0,
        bronze_medals: achievement.bronze_medals || 0,
        banner_image_file: null,
        banner_image_preview: null,
        additional_images: [],
        delete_image_ids: []
      };
      
      this.showAddEditModal = true;
    },
    
    openViewModal(achievement) {
      this.selectedAchievement = achievement;
      this.showViewModal = true;
    },
    
    closeViewModal() {
      this.showViewModal = false;
      this.selectedAchievement = null;
    },
    
    closeAddEditModal() {
      this.showAddEditModal = false;
      this.resetForm();
    },
    
    openImageViewer(image) {
      this.viewerImage = image;
      this.showImageViewer = true;
    },
    
    closeImageViewer() {
      this.showImageViewer = false;
      this.viewerImage = null;
    },
    
    resetForm() {
      this.formData = {
        title: '',
        description: '',
        competition_name: '',
        event_date: '',
        competition_category: '',
        competition_level: '',
        location: '',
        total_medals_won: 0,
        gold_medals: 0,
        silver_medals: 0,
        bronze_medals: 0,
        banner_image_file: null,
        banner_image_preview: null,
        additional_images: [],
        delete_image_ids: []
      };
      this.existingImages = [];
      this.selectedAchievement = null;
    },
    
    handleBannerUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.formData.banner_image_file = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.formData.banner_image_preview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    
    handleAdditionalImagesUpload(event) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.formData.additional_images.push({
            file: file,
            preview: e.target.result
          });
        };
        reader.readAsDataURL(file);
      });
    },
    
    removeNewImage(index) {
      this.formData.additional_images.splice(index, 1);
    },
    
    markImageForDeletion(imageUrl) {
      const index = this.formData.delete_image_ids.indexOf(imageUrl);
      if (index > -1) {
        this.formData.delete_image_ids.splice(index, 1);
      } else {
        this.formData.delete_image_ids.push(imageUrl);
      }
    },
    
    async submitForm() {
      if (!this.formData.title.trim()) {
        this.showToast('Title is required', 'error');
        return;
      }
      
      this.submitting = true;
      
      try {
        if (this.isEditMode) {
          await this.updateAchievement();
        } else {
          await this.addAchievement();
        }
      } catch (err) {
        console.error('Submit error:', err);
        this.showToast('Failed to save achievement', 'error');
      } finally {
        this.submitting = false;
      }
    },
    
    async addAchievement() {
      const formDataToSend = new FormData();
      
      const achievementData = [{
        title: this.formData.title,
        description: this.formData.description,
        competition_name: this.formData.competition_name,
        event_date: this.formData.event_date,
        competition_category: this.formData.competition_category,
        competition_level: this.formData.competition_level,
        location: this.formData.location,
        total_medals_won: this.formData.total_medals_won,
        gold_medals: this.formData.gold_medals,
        silver_medals: this.formData.silver_medals,
        bronze_medals: this.formData.bronze_medals
      }];
      
      formDataToSend.append('academyAchievementsData', JSON.stringify(achievementData));
      
      if (this.formData.banner_image_file) {
        formDataToSend.append('banner_image_0', this.formData.banner_image_file);
      }
      
      this.formData.additional_images.forEach(img => {
        formDataToSend.append('images_0', img.file);
      });
      
      try {
        const response = await fetch(`${this.baseUrl}/vsa/admin/add-new-academy-achievement`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: formDataToSend
        });
        
        const data = await response.json();
        
        if (data.success) {
          this.showToast('Achievement added successfully', 'success');
          this.closeAddEditModal();
          this.fetchAchievements();
        } else {
          this.showToast(data.message || 'Failed to add achievement', 'error');
        }
      } catch (err) {
        throw err;
      }
    },
    
    async updateAchievement() {
      const formDataToSend = new FormData();
      
      const achievementData = {
        title: this.formData.title,
        description: this.formData.description,
        competition_name: this.formData.competition_name,
        event_date: this.formData.event_date,
        competition_category: this.formData.competition_category,
        competition_level: this.formData.competition_level,
        location: this.formData.location,
        total_medals_won: this.formData.total_medals_won,
        gold_medals: this.formData.gold_medals,
        silver_medals: this.formData.silver_medals,
        bronze_medals: this.formData.bronze_medals
      };
      
      formDataToSend.append('achievementData', JSON.stringify(achievementData));
      
      if (this.formData.banner_image_file) {
        formDataToSend.append('banner_image', this.formData.banner_image_file);
      }
      
      this.formData.additional_images.forEach(img => {
        formDataToSend.append('additional_images', img.file);
      });
      
      if (this.formData.delete_image_ids.length > 0) {
        formDataToSend.append('delete_image_ids', JSON.stringify(this.formData.delete_image_ids));
      }
      
      try {
        const response = await fetch(`${this.baseUrl}/vsa/admin/update-academy-achievement/${this.selectedAchievement.id}`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: formDataToSend
        });
        
        const data = await response.json();
        
        if (data.success) {
          this.showToast('Achievement updated successfully', 'success');
          this.closeAddEditModal();
          this.fetchAchievements();
        } else {
          this.showToast(data.message || 'Failed to update achievement', 'error');
        }
      } catch (err) {
        throw err;
      }
    },
    
    confirmDelete(id) {
      this.deleteId = id;
      this.showDeleteConfirm = true;
    },
    
    async deleteAchievement() {
      this.deleting = true;
      
      try {
        const response = await fetch(`${this.baseUrl}/vsa/admin/delete-academy-achievement/${this.deleteId}`, {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        });
        
        const data = await response.json();
        
        if (data.success) {
          this.showToast('Achievement deleted successfully', 'success');
          this.showDeleteConfirm = false;
          this.deleteId = null;
          this.fetchAchievements();
        } else {
          this.showToast(data.message || 'Failed to delete achievement', 'error');
        }
      } catch (err) {
        console.error('Delete error:', err);
        this.showToast('Failed to delete achievement', 'error');
      } finally {
        this.deleting = false;
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    },
    
    showToast(message, type = 'success') {
      this.toast = {
        show: true,
        message,
        type
      };
      
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
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