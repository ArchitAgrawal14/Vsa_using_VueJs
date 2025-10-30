<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="pt-20 mb-8 sm:mb-12">
        <div class="text-center mb-6 sm:mb-8">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
            Manage Student Achievements
          </h1>
          <p class="text-gray-600 text-sm sm:text-base">
            Search and manage student records efficiently
          </p>
        </div>
        <div class="max-w-2xl mx-auto">
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by student name..."
              class="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="relative w-16 h-16 mb-4">
          <div class="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
          <div class="absolute top-0 left-0 w-full h-full border-4 border-gray-900 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p class="text-gray-600 text-lg">Loading students...</p>
      </div>

      <div v-else-if="error" class="max-w-md mx-auto">
        <div class="bg-white border-2 border-red-200 rounded-xl p-8 text-center shadow-lg">
          <svg class="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-red-600 font-medium text-lg">{{ error }}</p>
        </div>
      </div>

      <!-- No Data State -->
      <div v-else-if="filteredStudents.length === 0" class="max-w-md mx-auto">
        <div class="bg-white border-2 border-gray-200 rounded-xl p-8 text-center shadow-lg">
          <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <p class="text-gray-600 font-medium text-lg">No students found</p>
          <p class="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
        </div>
      </div>

      <!-- Students Table -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Student ID
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Full Name
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Mother's Name
                </th>
                <th class="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Group
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="student in filteredStudents"
                :key="student.student_id"
                @click="navigateToStudent(student.student_id)"
                class="hover:bg-gray-50 transition-colors duration-150 cursor-pointer group"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-semibold text-gray-900 group-hover:text-black">
                    {{ student.student_id }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900 group-hover:text-black">
                    {{ student.full_name }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-600 group-hover:text-gray-900">
                    {{ student.mother_name }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                    {{ student.student_group }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden divide-y divide-gray-200">
          <div
            v-for="student in filteredStudents"
            :key="student.student_id"
            @click="navigateToStudent(student.student_id)"
            class="p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer active:bg-gray-100"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                ID: {{ student.student_id }}
              </span>
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-900 text-white">
                {{ student.student_group }}
              </span>
            </div>
            <h3 class="text-base font-semibold text-gray-900 mb-1">
              {{ student.full_name }}
            </h3>
            <p class="text-sm text-gray-600">
              Mother: {{ student.mother_name }}
            </p>
            <div class="mt-3 flex items-center text-xs text-gray-500">
              <span>Tap to view details</span>
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Results Count Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p class="text-sm text-gray-600 text-center">
            Showing <span class="font-semibold text-gray-900">{{ filteredStudents.length }}</span> 
            {{ filteredStudents.length === 1 ? 'student' : 'students' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ManageStudentAchievements',
  data() {
    return {
      students: [],
      searchQuery: '',
      loading: true,
      error: null
    };
  },
  computed: {
    filteredStudents() {
      if (!this.searchQuery) {
        return this.students;
      }
      const query = this.searchQuery.toLowerCase();
      return this.students.filter(student =>
        student.full_name.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    async fetchStudents() {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await axios.get(
          'http://localhost:3000/vsa/admin/get-students-for-manage-achievements',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.data.success) {
          this.students = response.data.studentDetails;
        } else {
          this.error = response.data.message || 'Failed to fetch students';
        }
      } catch (err) {
        if (err.response?.status === 204) {
          this.students = [];
          this.error = 'No students found';
        } else if (err.response?.status === 403) {
          this.error = 'Access denied. Admin privileges required.';
        } else {
          this.error = 'Failed to load students. Please try again.';
        }
        console.error('Error fetching students:', err);
      } finally {
        this.loading = false;
      }
    },
    navigateToStudent(studentId) {
      this.$router.push({
        name: 'StudentAchievementDetail',
        params: { studentId }
      });
    }
  },
  mounted() {
    this.fetchStudents();
  }
};
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>