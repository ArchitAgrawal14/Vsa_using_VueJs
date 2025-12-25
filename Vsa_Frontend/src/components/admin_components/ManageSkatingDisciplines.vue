<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 mt-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Manage Skating Disciplines</h1>
        <p class="text-gray-600">Add, edit, and manage skating events and tours</p>
      </div>

      <!-- Add Event Button -->
      <div class="mb-6">
        <button
          @click="openAddModal"
          class="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
        >
          + Add New Event
        </button>
      </div>

      <!-- Discipline Tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            @click="activeDiscipline = 'roller'"
            :class="[
              activeDiscipline === 'roller'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
            ]"
          >
            Roller Speed Skating
          </button>
          <button
            @click="activeDiscipline = 'ice'"
            :class="[
              activeDiscipline === 'ice'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
            ]"
          >
            Ice Skating
          </button>
        </nav>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <p class="mt-4 text-gray-600">Loading events...</p>
      </div>

      <!-- Events Grid -->
      <div v-else-if="currentEvents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(event, index) in currentEvents"
          :key="index"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
        >
          <!-- Date Badge -->
          <div class="bg-black text-white p-4 text-center">
            <div class="text-3xl font-bold">{{ event.date }}</div>
            <div class="text-sm uppercase tracking-wider">{{ event.month }} {{ event.year }}</div>
          </div>

          <!-- Event Details -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ event.title }}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ event.description }}</p>
            
            <div class="space-y-2 mb-4">
              <div class="flex items-center text-sm">
                <span class="font-medium text-gray-700 w-24">Category:</span>
                <span class="text-gray-600 capitalize">{{ event.category }}</span>
              </div>
              <div class="flex items-center text-sm">
                <span class="font-medium text-gray-700 w-24">Location:</span>
                <span class="text-gray-600">{{ event.location }}</span>
              </div>
              <div class="flex items-center text-sm">
                <span class="font-medium text-gray-700 w-24">Tour Fees:</span>
                <span class="text-gray-600">₹{{ event.tourFees }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-2 pt-4 border-t border-gray-200">
              <button
                @click="openEditModal(event, index)"
                class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(event, index)"
                class="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded hover:bg-red-100 transition-colors text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-white rounded-lg shadow">
        <p class="text-gray-500 text-lg">No events found for this discipline.</p>
        <button
          @click="openAddModal"
          class="mt-4 text-black hover:underline font-medium"
        >
          Add your first event
        </button>
      </div>

      <!-- Add/Edit Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mt-12">
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              {{ isEditMode ? 'Edit Event' : 'Add New Event' }}
            </h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  v-model="formData.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Event title"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  v-model="formData.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Event description"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                  <input
                    v-model="formData.eventDate"
                    type="date"
                    :min="minDate"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Competition Category *</label>
                  <select
                    v-model="formData.competitionCategory"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="Roller Speed Skating">Roller Speed Skating</option>
                    <option value="Roll Ball">Roll Ball</option>
                    <option value="Ice Skating">Ice Skating</option>
                    <option value="Record">Record</option>
                    <option value="Camp">Camp</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Competition Level *</label>
                  <select
                    v-model="formData.competitionLevel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select level</option>
                    <option value="school">School</option>
                    <option value="block">Block</option>
                    <option value="district">District</option>
                    <option value="division">Division</option>
                    <option value="state">State</option>
                    <option value="national">National</option>
                    <option value="international">International</option>
                    <option value="record">Record</option>
                    <option value="RSFI">RSFI</option>
                    <option value="SGFI">SGFI</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tour Fees *</label>
                  <input
                    v-model.number="formData.tourFees"
                    type="number"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  v-model="formData.location"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Event location"
                />
              </div>

              <!-- Form Actions -->
              <div class="flex space-x-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click="submitForm"
                  :disabled="submitting"
                  class="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
                >
                  {{ submitting ? 'Saving...' : (isEditMode ? 'Update Event' : 'Add Event') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="closeDeleteModal"
      >
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
          <p class="text-gray-600 mb-6">
            Are you sure you want to delete "{{ eventToDelete?.title }}"? This action cannot be undone.
          </p>
          <div class="flex space-x-3">
            <button
              @click="closeDeleteModal"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              @click="deleteEvent"
              :disabled="submitting"
              class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
            >
              {{ submitting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Toast Notification -->
      <div
        v-if="toast.show"
        :class="[
          'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300 z-50',
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        ]"
      >
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ManageSkatingDisciplines',
  data() {
    return {
      activeDiscipline: 'roller',
      rollerEvents: [],
      iceEvents: [],
      loading: false,
      showModal: false,
      showDeleteModal: false,
      isEditMode: false,
      submitting: false,
      eventToDelete: null,
      editingEventIndex: null,
      formData: {
        title: '',
        description: '',
        eventDate: '',
        competitionCategory: '',
        competitionLevel: '',
        location: '',
        tourFees: 0
      },
      toast: {
        show: false,
        message: '',
        type: 'success'
      }
    };
  },
  computed: {
    currentEvents() {
      return this.activeDiscipline === 'roller' ? this.rollerEvents : this.iceEvents;
    },
    minDate() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        
        // Fetch roller events
        const rollerResponse = await fetch('http://localhost:3000/vsa/roller-speed-skating-discipline', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const rollerData = await rollerResponse.json();
        if (rollerData.success) {
          this.rollerEvents = rollerData.events;
        }

        // Fetch ice events
        const iceResponse = await fetch('http://localhost:3000/vsa/ice-skating-discipline', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const iceData = await iceResponse.json();
        if (iceData.success) {
          this.iceEvents = iceData.events;
        }
      } catch (error) {
        this.showToast('Failed to fetch events', 'error');
        console.error('Fetch error:', error);
      } finally {
        this.loading = false;
      }
    },
    openAddModal() {
      this.isEditMode = false;
      this.resetForm();
      this.showModal = true;
    },
    openEditModal(event, index) {
      this.isEditMode = true;
      this.editingEventIndex = index;
      
      // Store the event ID
      const monthNum = this.getMonthNumber(event.month);
      const dateStr = `${event.year}-${String(monthNum).padStart(2, '0')}-${String(event.date).padStart(2, '0')}`;
      
      this.formData = {
        id: event.id,
        title: event.title,
        description: event.description,
        eventDate: dateStr,
        competitionCategory: this.determineCategory(event),
        competitionLevel: event.category,
        location: event.location,
        tourFees: event.tourFees
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        title: '',
        description: '',
        eventDate: '',
        competitionCategory: '',
        competitionLevel: '',
        location: '',
        tourFees: 0
      };
      this.editingEventIndex = null;
    },
    validateForm() {
      if (!this.formData.title.trim()) {
        this.showToast('Title is required', 'error');
        return false;
      }
      if (!this.formData.description.trim()) {
        this.showToast('Description is required', 'error');
        return false;
      }
      if (!this.formData.eventDate) {
        this.showToast('Event date is required', 'error');
        return false;
      }
      if (!this.formData.competitionCategory) {
        this.showToast('Competition category is required', 'error');
        return false;
      }
      if (!this.formData.competitionLevel) {
        this.showToast('Competition level is required', 'error');
        return false;
      }
      if (!this.formData.location.trim()) {
        this.showToast('Location is required', 'error');
        return false;
      }
      if (this.formData.tourFees < 0) {
        this.showToast('Tour fees must be a positive number', 'error');
        return false;
      }
      return true;
    },
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }
      
      this.submitting = true;
      try {
        if (this.isEditMode) {
          await this.updateEvent();
        } else {
          await this.addEvent();
        }
      } finally {
        this.submitting = false;
      }
    },
    async addEvent() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/vsa/admin/add-skating-events-and-tours', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            insertedData: [{
              title: this.formData.title,
              description: this.formData.description,
              eventDate: this.formData.eventDate,
              competitionCategory: this.formData.competitionCategory,
              competitionLevel: this.formData.competitionLevel,
              location: this.formData.location,
              tourFees: this.formData.tourFees
            }]
          })
        });

        const data = await response.json();
        if (data.success) {
          this.showToast('Event added successfully', 'success');
          this.closeModal();
          await this.fetchEvents();
        } else {
          this.showToast(data.message || 'Failed to add event', 'error');
        }
      } catch (error) {
        this.showToast('Failed to add event', 'error');
        console.error('Add error:', error);
      }
    },
    async updateEvent() {
      try {
        const token = localStorage.getItem('token');
        const eventId = this.formData.id;
        
        const response = await fetch(`http://localhost:3000/vsa/admin/update-skating-event/${eventId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: this.formData.title,
            description: this.formData.description,
            eventDate: this.formData.eventDate,
            competitionCategory: this.formData.competitionCategory,
            competitionLevel: this.formData.competitionLevel,
            location: this.formData.location,
            tourFees: this.formData.tourFees
          })
        });

        const data = await response.json();
        if (data.success) {
          this.showToast('Event updated successfully', 'success');
          this.closeModal();
          await this.fetchEvents();
        } else {
          this.showToast(data.message || 'Failed to update event', 'error');
        }
      } catch (error) {
        this.showToast('Failed to update event', 'error');
        console.error('Update error:', error);
      }
    },
    confirmDelete(event, index) {
      this.eventToDelete = event;
      this.editingEventIndex = index;
      this.showDeleteModal = true;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.eventToDelete = null;
      this.editingEventIndex = null;
    },
    async deleteEvent() {
      this.submitting = true;
      try {
        const token = localStorage.getItem('token');
        const eventId = this.eventToDelete.id;
        
        const response = await fetch(`http://localhost:3000/vsa/admin/delete-skating-event/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          this.showToast('Event deleted successfully', 'success');
          this.closeDeleteModal();
          await this.fetchEvents();
        } else {
          this.showToast(data.message || 'Failed to delete event', 'error');
        }
      } catch (error) {
        this.showToast('Failed to delete event', 'error');
        console.error('Delete error:', error);
      } finally {
        this.submitting = false;
      }
    },
    showToast(message, type = 'success') {
      this.toast = { show: true, message, type };
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    },
    getMonthNumber(monthAbbr) {
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return months.indexOf(monthAbbr) + 1;
    },
    determineCategory(event) {
      // Since GET endpoints filter by category, we need to infer from current tab
      if (this.activeDiscipline === 'ice') {
        return 'Ice Skating';
      }
      return 'Roller Speed Skating';
    }
  }
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>