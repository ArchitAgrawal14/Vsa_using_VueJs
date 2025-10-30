<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Student Attendance</h1>
        <p class="text-gray-600 mt-2">Mark and manage student attendance records</p>
      </div>

      <!-- Date Selector -->
      <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center space-x-4">
            <label for="attendance-date" class="text-sm font-medium text-gray-700">
              Select Date:
            </label>
            <input
              id="attendance-date"
              type="date"
              v-model="selectedDate"
              @change="fetchAttendanceData"
              class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="mt-4 sm:mt-0">
            <span class="text-sm text-gray-500">
              Total Students: {{ attendanceDetails.length }}
            </span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600">Loading attendance data...</span>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-800">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Attendance Table -->
      <div v-if="!loading && attendanceDetails.length > 0" class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            Attendance for {{ formatDate(selectedDate) }}
          </h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mother's Name
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="student in attendanceDetails" :key="student.student_id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ student.student_id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ student.full_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ student.mother_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex justify-center space-x-4">
                    <!-- Present Radio -->
                    <label class="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        :name="`attendance-${student.student_id}`"
                        value="Present"
                        :checked="student.status === 'Present'"
                        @change="updateAttendance(student.student_id, 'Present')"
                        class="sr-only"
                        :disabled="updating === student.student_id"
                      />
                      <div :class="[
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                        student.status === 'Present' 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300 hover:border-green-400',
                        updating === student.student_id ? 'opacity-50 cursor-not-allowed' : ''
                      ]">
                        <div v-if="student.status === 'Present'" class="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span class="ml-2 text-sm text-green-700 font-medium">Present</span>
                    </label>

                    <!-- Absent Radio -->
                    <label class="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        :name="`attendance-${student.student_id}`"
                        value="Absent"
                        :checked="student.status === 'Absent'"
                        @change="updateAttendance(student.student_id, 'Absent')"
                        class="sr-only"
                        :disabled="updating === student.student_id"
                      />
                      <div :class="[
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                        student.status === 'Absent' 
                          ? 'bg-red-500 border-red-500' 
                          : 'border-gray-300 hover:border-red-400',
                        updating === student.student_id ? 'opacity-50 cursor-not-allowed' : ''
                      ]">
                        <div v-if="student.status === 'Absent'" class="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span class="ml-2 text-sm text-red-700 font-medium">Absent</span>
                    </label>

                    <!-- Sick Radio -->
                    <label class="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        :name="`attendance-${student.student_id}`"
                        value="Sick"
                        :checked="student.status === 'Sick'"
                        @change="updateAttendance(student.student_id, 'Sick')"
                        class="sr-only"
                        :disabled="updating === student.student_id"
                      />
                      <div :class="[
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                        student.status === 'Sick' 
                          ? 'bg-yellow-500 border-yellow-500' 
                          : 'border-gray-300 hover:border-yellow-400',
                        updating === student.student_id ? 'opacity-50 cursor-not-allowed' : ''
                      ]">
                        <div v-if="student.status === 'Sick'" class="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span class="ml-2 text-sm text-yellow-700 font-medium">Sick</span>
                    </label>

                    <!-- Loading indicator for individual student -->
                    <div v-if="updating === student.student_id" class="flex items-center">
                      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No Data State -->
      <div v-if="!loading && attendanceDetails.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No students found</h3>
        <p class="mt-1 text-sm text-gray-500">No students are available for the selected date.</p>
      </div>

      <!-- Attendance Summary -->
      <div v-if="!loading && attendanceDetails.length > 0" class="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div class="bg-white rounded-lg shadow-sm border p-4">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span class="text-sm text-gray-600">Present: {{ getAttendanceCount('Present') }}</span>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border p-4">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span class="text-sm text-gray-600">Absent: {{ getAttendanceCount('Absent') }}</span>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border p-4">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span class="text-sm text-gray-600">Sick: {{ getAttendanceCount('Sick') }}</span>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm border p-4">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
            <span class="text-sm text-gray-600">Unmarked: {{ getAttendanceCount(null) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AttendancePage',
  data() {
    return {
      selectedDate: new Date().toISOString().slice(0, 10), // Today's date in YYYY-MM-DD format
      attendanceDetails: [],
      loading: false,
      error: null,
      successMessage: null,
      updating: null, // Track which student's attendance is being updated
    }
  },
  
  mounted() {
    this.fetchAttendanceData()
  },
  
  methods: {
    async fetchAttendanceData() {
      this.loading = true
      this.error = null
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/vsa/admin/get-students-for-attendance', {
          params: { date: this.selectedDate },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.data.success) {
          this.attendanceDetails = response.data.attendanceDetails
        } else {
          this.error = response.data.message || 'Failed to fetch attendance data'
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching attendance data:', error)
        this.error = error.response?.data?.message || 'Something went wrong while fetching attendance data'
      } finally {
        this.loading = false
      }
    },
    
    async updateAttendance(studentId, status) {
      this.updating = studentId
      this.error = null
      this.successMessage = null
      
      try {
        const token = localStorage.getItem('token')
        
        // Prepare the attendance data
        const attendanceData = {
          date: this.selectedDate,
          studentId: studentId,
          status: status
        }
        
        const response = await axios.post('http://localhost:3000/vsa/admin/mark-attendance', attendanceData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.data.success) {
          // Update the local data
          const studentIndex = this.attendanceDetails.findIndex(s => s.student_id === studentId)
          if (studentIndex !== -1) {
            this.attendanceDetails[studentIndex].status = status
          }
          
          this.successMessage = `Attendance updated successfully for student ${studentId}`
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = null
          }, 3000)
        } else {
          this.error = response.data.message || 'Failed to update attendance'
        }
      } catch (error) {
        console.error('Error updating attendance:', error)
        this.error = error.response?.data?.message || 'Something went wrong while updating attendance'
      } finally {
        this.updating = null
      }
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    getAttendanceCount(status) {
      if (status === null) {
        return this.attendanceDetails.filter(student => !student.status).length
      }
      return this.attendanceDetails.filter(student => student.status === status).length
    }
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>