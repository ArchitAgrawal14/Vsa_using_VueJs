<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <div class="bg-black text-white shadow-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button 
          @click="goBack" 
          class="group inline-flex items-center gap-2 text-sm font-medium hover:text-gray-300 transition-colors duration-200"
        >
          <svg class="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Students
        </button>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center min-h-[60vh]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
          <p class="mt-4 text-lg text-gray-600">Loading student achievements...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center min-h-[60vh]">
        <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p class="text-gray-800 text-lg">{{ error }}</p>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="space-y-8">
        <!-- Student Info Card -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
          <div class="bg-gradient-to-r from-black to-gray-800 px-6 sm:px-8 py-6">
            <h1 class="text-3xl sm:text-4xl font-bold text-white">{{ studentInfo.full_name }}</h1>
          </div>
          <div class="px-6 sm:px-8 py-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="group">
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Student ID</div>
                <div class="text-lg font-medium text-gray-900">{{ studentInfo.student_id }}</div>
              </div>
              <div class="group">
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Mother's Name</div>
                <div class="text-lg font-medium text-gray-900">{{ studentInfo.mother_name }}</div>
              </div>
              <div class="group">
                <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Group</div>
                <div class="text-lg font-medium text-gray-900">{{ studentInfo.student_group }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Achievements Section -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <!-- Section Header -->
          <div class="border-b border-gray-200 px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Achievements</h2>
            <button 
              @click="showAddModal = true" 
              class="group inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Achievement
            </button>
          </div>

          <!-- No Achievements -->
          <div v-if="achievements.length === 0" class="px-6 sm:px-8 py-16 text-center">
            <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p class="text-gray-500 text-lg">No achievements found for this student.</p>
            <p class="text-gray-400 text-sm mt-2">Click "Add Achievement" to create the first one.</p>
          </div>

          <!-- Achievements List -->
          <div v-else class="px-6 sm:px-8 py-6 space-y-4">
            <div
              v-for="achievement in achievements"
              :key="achievement.id"
              class="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 hover:border-black transition-all duration-300 hover:shadow-lg"
            >
              <div class="flex items-start justify-between gap-4 mb-4">
                <h3 class="text-xl font-bold text-gray-900 flex-1 group-hover:text-black transition-colors">
                  {{ achievement.achievement_title }}
                </h3>
                <button
                  @click="deleteAchievement(achievement.id)"
                  class="flex-shrink-0 p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
                  title="Delete Achievement"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div class="space-y-3">
                <div class="flex flex-wrap items-center gap-3">
                  <span class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-black text-white">
                    {{ formatType(achievement.achievement_type) }}
                  </span>
                  <span class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-gray-200 text-gray-900">
                    {{ formatLevel(achievement.achievement_level) }}
                  </span>
                </div>

                <div v-if="achievement.event_name" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</div>
                    <div class="text-gray-900 font-medium">{{ achievement.event_name }}</div>
                  </div>
                </div>

                <div v-if="achievement.date_of_achievement" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</div>
                    <div class="text-gray-900 font-medium">{{ formatDate(achievement.date_of_achievement) }}</div>
                  </div>
                </div>

                <div v-if="achievement.remarks" class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <div>
                    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Remarks</div>
                    <div class="text-gray-700">{{ achievement.remarks }}</div>
                  </div>
                </div>

                <div v-if="achievement.link" class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <a 
                    :href="achievement.link" 
                    target="_blank" 
                    class="text-black font-semibold hover:underline inline-flex items-center gap-1 group/link"
                  >
                    View Details
                    <svg class="w-4 h-4 transform group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Achievement Modal -->
    <transition name="modal">
      <div v-if="showAddModal" class="fixed inset-0 z-50 overflow-y-auto" @click="closeModal">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 transition-opacity bg-black bg-opacity-75" aria-hidden="true"></div>

          <!-- Modal panel -->
          <div 
            class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
            @click.stop
          >
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-black to-gray-800 px-6 sm:px-8 py-6 flex items-center justify-between">
              <h2 class="text-2xl font-bold text-white">Add New Achievement</h2>
              <button
                @click="closeModal"
                class="text-gray-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <form @submit.prevent="addAchievement" class="px-6 sm:px-8 py-6 space-y-6">
              <div>
                <label class="block text-sm font-bold text-gray-900 mb-2">
                  Achievement Title <span class="text-red-600">*</span>
                </label>
                <input
                  v-model="newAchievement.achievementTitle"
                  type="text"
                  required
                  placeholder="Enter achievement title"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-0 transition-colors"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-gray-900 mb-2">
                    Type <span class="text-red-600">*</span>
                  </label>
                  <select 
                    v-model="newAchievement.achievementType" 
                    required
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-0 transition-colors"
                  >
                    <option value="competition">Competition</option>
                    <option value="certificate">Certificate</option>
                    <option value="performance">Performance</option>
                    <option value="record">Record</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-900 mb-2">
                    Level <span class="text-red-600">*</span>
                  </label>
                  <select 
                    v-model="newAchievement.achievementLevel" 
                    required
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-0 transition-colors"
                  >
                    <option value="school">School</option>
                    <option value="block">Block</option>
                    <option value="district">District</option>
                    <option value="division">Division</option>
                    <option value="state">State</option>
                    <option value="national">National</option>
                    <option value="international">International</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-900 mb-2">Event Name</label>
                <input
                  v-model="newAchievement.eventName"
                  type="text"
                  placeholder="Enter event name (optional)"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-0 transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-900 mb-2">Date of Achievement</label>
                <input
                  v-model="newAchievement.dateOfAchievement"
                  type="date"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-0 transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-900 mb-2">Link</label>
                <input
                  v-model="newAchievement.link"
                  type="url"
                  placeholder="https://example.com (optional)"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-0 transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm font-bold text-gray-900 mb-2">Remarks</label>
                <textarea
                  v-model="newAchievement.remarks"
                  rows="3"
                  placeholder="Additional remarks (optional)"
                  class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-black focus:ring-0 transition-colors resize-none"
                ></textarea>
              </div>

              <!-- Modal Actions -->
              <div class="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 sm:flex-initial px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="flex-1 sm:flex-initial px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {{ submitting ? 'Adding...' : 'Add Achievement' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'StudentAchievementDetail',
  data() {
    return {
      studentInfo: {},
      achievements: [],
      loading: true,
      error: null,
      showAddModal: false,
      submitting: false,
      newAchievement: {
        achievementTitle: '',
        achievementType: 'competition',
        achievementLevel: 'school',
        eventName: '',
        dateOfAchievement: '',
        link: '',
        remarks: ''
      }
    };
  },
  methods: {
    async fetchStudentAchievements() {
      try {
        this.loading = true;
        this.error = null;

        const response = await axios.get(
          'http://localhost:3000/vsa/admin/get-student-for-manage-achievements',
          {
            params: {
              studentId: this.$route.params.studentId
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.data.success) {
          const data = response.data.studentAchievementsDetail;
          
          this.studentInfo = {
            student_id: data[0].student_id,
            full_name: data[0].full_name,
            mother_name: data[0].mother_name,
            student_group: data[0].student_group
          };

          this.achievements = data
            .filter(item => item.achievement_title !== null)
            .map(item => ({
              id: item.id,
              achievement_title: item.achievement_title,
              achievement_type: item.achievement_type,
              achievement_level: item.achievement_level,
              event_name: item.event_name,
              date_of_achievement: item.date_of_achievement,
              link: item.link,
              remarks: item.remarks
            }));
        }
      } catch (err) {
        if (err.response?.status === 204) {
          this.error = 'No student found with this ID';
        } else if (err.response?.status === 403) {
          this.error = 'Access denied. Admin privileges required.';
        } else {
          this.error = 'Failed to load student achievements. Please try again.';
        }
        console.error('Error fetching student achievements:', err);
      } finally {
        this.loading = false;
      }
    },
    async addAchievement() {
      try {
        this.submitting = true;

        const response = await axios.post(
          'http://localhost:3000/vsa/admin/add-new-achievement',
          {
            studentId: this.$route.params.studentId,
            achievementTitle: this.newAchievement.achievementTitle,
            achievementType: this.newAchievement.achievementType,
            achievementLevel: this.newAchievement.achievementLevel,
            eventName: this.newAchievement.eventName || null,
            dateOfAchievement: this.newAchievement.dateOfAchievement || null,
            link: this.newAchievement.link || null,
            remarks: this.newAchievement.remarks || null
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.data.success) {
          alert('Achievement added successfully!');
          this.closeModal();
          this.fetchStudentAchievements();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to add achievement');
        console.error('Error adding achievement:', err);
      } finally {
        this.submitting = false;
      }
    },
    async deleteAchievement(achievementId) {
      if (!confirm('Are you sure you want to delete this achievement?')) {
        return;
      }

      try {
        await axios.delete(
          `http://localhost:3000/vsa/admin/delete-achievement/${achievementId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        alert('Achievement deleted successfully!');
        this.fetchStudentAchievements();
      } catch (err) {
        alert('Failed to delete achievement');
        console.error('Error deleting achievement:', err);
      }
    },
    closeModal() {
      this.showAddModal = false;
      this.newAchievement = {
        achievementTitle: '',
        achievementType: 'competition',
        achievementLevel: 'school',
        eventName: '',
        dateOfAchievement: '',
        link: '',
        remarks: ''
      };
    },
    goBack() {
      this.$router.push({ name: 'ManageAchievements' });
    },
    formatType(type) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    },
    formatLevel(level) {
      return level.charAt(0).toUpperCase() + level.slice(1);
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  mounted() {
    this.fetchStudentAchievements();
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Custom scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>