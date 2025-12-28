<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="pt-24 mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Attendance Records</h1>
        <p class="mt-2 text-sm text-gray-600">View student attendance records</p>
      </div>

      <!-- Search and Filter Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <!-- Search Bar -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, student ID, or mother's name..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <!-- Attendance Lookup -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
            <input
              v-model="selectedStudentId"
              type="text"
              placeholder="Enter student ID"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              v-model="selectedMonth"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select Month</option>
              <option v-for="month in months" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              v-model="selectedYear"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select Year</option>
              <option v-for="year in years" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <div>
            <button
              @click="fetchAttendanceDetails"
              :disabled="!selectedStudentId || !selectedMonth || !selectedYear || isLoadingAttendance"
              class="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
            >
              {{ isLoadingAttendance ? 'Loading...' : 'View Attendance' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Attendance Details Modal -->
      <div
        v-if="showAttendanceDetails"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
        @click.self="closeAttendanceDetails"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <!-- Modal Header -->
          <div class="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
            <div>
              <h2 class="text-xl font-bold">Attendance Details</h2>
              <p class="text-sm text-blue-100 mt-1">
                {{ getMonthName(selectedMonth) }} {{ selectedYear }} - Student ID: {{ selectedStudentId }}
              </p>
            </div>
            <button
              @click="closeAttendanceDetails"
              class="text-white hover:text-gray-200 transition"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Summary Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-gray-50">
            <div class="bg-green-100 rounded-lg p-4 border border-green-200">
              <p class="text-sm text-green-700 font-medium">Present</p>
              <p class="text-3xl font-bold text-green-800">{{ attendanceSummary.present }}</p>
            </div>
            <div class="bg-red-100 rounded-lg p-4 border border-red-200">
              <p class="text-sm text-red-700 font-medium">Absent</p>
              <p class="text-3xl font-bold text-red-800">{{ attendanceSummary.absent }}</p>
            </div>
            <div class="bg-yellow-100 rounded-lg p-4 border border-yellow-200">
              <p class="text-sm text-yellow-700 font-medium">Sick</p>
              <p class="text-3xl font-bold text-yellow-800">{{ attendanceSummary.sick }}</p>
            </div>
          </div>

          <!-- Download Buttons -->
          <div class="px-6 py-4 bg-gray-50 border-y border-gray-200 flex gap-3">
            <button
              @click="downloadPDF"
              :disabled="isDownloading"
              class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {{ isDownloading ? 'Downloading...' : 'Download PDF' }}
            </button>
            <button
              @click="downloadCSV"
              :disabled="isDownloading"
              class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {{ isDownloading ? 'Downloading...' : 'Download CSV' }}
            </button>
          </div>

          <!-- Attendance Table -->
          <div class="overflow-auto max-h-96 p-6">
            <table class="w-full">
              <thead class="bg-gray-100 sticky top-0">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Marked By</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="record in attendanceRecords" :key="record.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ formatDate(record.attendance_date) }}</td>
                  <td class="px-4 py-3 text-sm">
                    <span
                      :class="{
                        'bg-green-100 text-green-800': record.status === 'Present',
                        'bg-red-100 text-red-800': record.status === 'Absent',
                        'bg-yellow-100 text-yellow-800': record.status === 'Sick'
                      }"
                      class="px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {{ record.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">{{ record.marked_by || 'N/A' }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500">{{ formatTime(record.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              @click="closeAttendanceDetails"
              class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Students Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">All Students</h2>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="p-8 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p class="mt-2 text-gray-600">Loading students...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-8 text-center text-red-600">
          <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{{ error }}</p>
        </div>

        <!-- Students Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Student ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Full Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Mother's Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Group</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="student in filteredStudents" :key="student.student_id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  <div class="flex items-center gap-2">
                    <span>{{ student.student_id }}</span>
                    <button
                      @click="copyStudentId(student.student_id)"
                      class="text-gray-400 hover:text-blue-600 transition"
                      title="Copy Student ID"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">{{ student.full_name }}</td>
                <td class="px-6 py-4 text-sm text-gray-700">{{ student.mother_name }}</td>
                <td class="px-6 py-4 text-sm text-gray-700">{{ student.student_group }}</td>
              </tr>
              <tr v-if="filteredStudents.length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                  No students found matching your search.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AttendanceRecords',
  data() {
    return {
      students: [],
      searchQuery: '',
      isLoading: false,
      error: null,
      selectedStudentId: '',
      selectedMonth: '',
      selectedYear: '',
      showAttendanceDetails: false,
      attendanceRecords: [],
      isLoadingAttendance: false,
      isDownloading: false,
      downloadFiles: null,
      months: [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
      ],
      years: []
    };
  },
  computed: {
    filteredStudents() {
      if (!this.searchQuery) {
        return this.students;
      }
      const query = this.searchQuery.toLowerCase();
      return this.students.filter(student =>
        student.student_id.toLowerCase().includes(query) ||
        student.full_name.toLowerCase().includes(query) ||
        student.mother_name.toLowerCase().includes(query) ||
        student.student_group.toLowerCase().includes(query)
      );
    },
    attendanceSummary() {
      const summary = {
        present: 0,
        absent: 0,
        sick: 0
      };
      this.attendanceRecords.forEach(record => {
        if (record.status === 'Present') summary.present++;
        else if (record.status === 'Absent') summary.absent++;
        else if (record.status === 'Sick') summary.sick++;
      });
      return summary;
    }
  },
  mounted() {
    this.generateYears();
    this.fetchStudents();
  },
  methods: {
    generateYears() {
      const currentYear = new Date().getFullYear();
      for (let i = currentYear; i >= currentYear - 5; i--) {
        this.years.push(i);
      }
    },
    async fetchStudents() {
      this.isLoading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/vsa/admin/get-students-for-attendance-records', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch students');
        }

        this.students = data.studentDetails || [];
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching students:', err);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchAttendanceDetails() {
      if (!this.selectedStudentId || !this.selectedMonth || !this.selectedYear) {
        alert('Please fill in all fields');
        return;
      }

      this.isLoadingAttendance = true;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:3000/vsa/admin/get-student-attendance/${this.selectedStudentId}?month=${this.selectedMonth}&year=${this.selectedYear}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch attendance details');
        }

        this.attendanceRecords = data.attendanceDetails || [];
        this.downloadFiles = data.files || null;
        this.showAttendanceDetails = true;
      } catch (err) {
        alert(err.message);
        console.error('Error fetching attendance details:', err);
      } finally {
        this.isLoadingAttendance = false;
      }
    },
    closeAttendanceDetails() {
      this.showAttendanceDetails = false;
      this.attendanceRecords = [];
      this.downloadFiles = null;
    },
    downloadPDF() {
      if (!this.downloadFiles || !this.downloadFiles.pdf) {
        alert('PDF file not available');
        return;
      }

      this.isDownloading = true;
      try {
        // Convert base64 to blob
        const byteCharacters = atob(this.downloadFiles.pdf);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `attendance_${this.selectedStudentId}_${this.getMonthName(this.selectedMonth)}_${this.selectedYear}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Error downloading PDF:', err);
        alert('Failed to download PDF');
      } finally {
        this.isDownloading = false;
      }
    },
    downloadCSV() {
      if (!this.downloadFiles || !this.downloadFiles.csv) {
        alert('CSV file not available');
        return;
      }

      this.isDownloading = true;
      try {
        // Convert base64 to blob
        const byteCharacters = atob(this.downloadFiles.csv);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'text/csv' });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `attendance_${this.selectedStudentId}_${this.getMonthName(this.selectedMonth)}_${this.selectedYear}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Error downloading CSV:', err);
        alert('Failed to download CSV');
      } finally {
        this.isDownloading = false;
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    },
    formatTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    },
    getMonthName(monthNumber) {
      const month = this.months.find(m => m.value === monthNumber);
      return month ? month.label : '';
    },
    copyStudentId(studentId) {
      navigator.clipboard.writeText(studentId).then(() => {
      }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy Student ID');
      });
    }
  }
};
</script>

<style scoped>
</style>