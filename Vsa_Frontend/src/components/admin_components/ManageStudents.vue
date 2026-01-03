<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900"></h1>
      <p class="text-gray-600 mt-2"></p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- Students Table -->
    <div v-else-if="!selectedStudent" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">Students List</h2>
        <p class="text-sm text-gray-600 mt-1">Click on any row to view and edit student details</p>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mother Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Group
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pending Fee
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Download fee history
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="student in students"
              :key="student.student_id"
              class="hover:bg-gray-50 transition-colors duration-200"
            >
              <td 
                @click="fetchStudentDetails(student.student_id)"
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer"
              >
                {{ student.student_id }}
              </td>
              <td 
                @click="fetchStudentDetails(student.student_id)"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
              >
                {{ student.full_name }}
              </td>
              <td 
                @click="fetchStudentDetails(student.student_id)"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
              >
                {{ student.mother_name || 'N/A' }}
              </td>
              <td 
                @click="fetchStudentDetails(student.student_id)"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
              >
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {{ student.student_group || 'N/A' }}
                </span>
              </td>
              <td 
                @click="fetchStudentDetails(student.student_id)"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 cursor-pointer"
              >
                <span
                  class="font-medium"
                  :class="student.pending_fee > 0 ? 'text-red-600' : 'text-green-600'"
                >
                  ₹{{ student.pending_fee || 0 }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex space-x-2">
                  <button
                    @click.stop="downloadFeeHistory(student.student_id, 'pdf')"
                    :disabled="downloadingStudentId === student.student_id"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    title="Download PDF"
                  >
                    <svg v-if="downloadingStudentId !== student.student_id" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span v-if="downloadingStudentId === student.student_id" class="inline-block animate-spin mr-1">⏳</span>
                    PDF
                  </button>
                  <button
                    @click.stop="downloadFeeHistory(student.student_id, 'csv')"
                    :disabled="downloadingStudentId === student.student_id"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    title="Download CSV"
                  >
                    <svg v-if="downloadingStudentId !== student.student_id" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span v-if="downloadingStudentId === student.student_id" class="inline-block animate-spin mr-1">⏳</span>
                    CSV
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="students.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-lg">No students found</div>
      </div>
    </div>

    <!-- Student Detail View -->
    <div v-else class="bg-white rounded-lg shadow-md mt-8">
      <!-- Back Button -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center">
          <button
            @click="goBack"
            class="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            ← Back to List
          </button>
          <h2 class="text-xl font-semibold text-gray-800">Edit Student Details</h2>
        </div>
        <div class="flex space-x-2">
          <button
            v-if="hasChanges"
            @click="saveChanges"
            class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            Save Changes
          </button>
          <button
            v-if="hasChanges"
            @click="resetChanges"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Student Details Form -->
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Basic Information
            </h3>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
              <input
                v-model="editableStudent.student_id"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                readonly
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                v-model="editableStudent.full_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Father Name</label>
              <input
                v-model="editableStudent.father_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mother Name</label>
              <input
                v-model="editableStudent.mother_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                v-model="editableStudent.email"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
              <input
                v-model="editableStudent.mobile_number"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input
                v-model="editableStudent.whatsapp_number"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                v-model="editableStudent.dob"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Class *</label>
              <input
                v-model="editableStudent.class"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select
                v-model="editableStudent.gender"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @change="markAsChanged"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Additional Information
            </h3>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">School Name</label>
              <input
                v-model="editableStudent.school_name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hobbies</label>
              <input
                v-model="editableStudent.hobbies"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Student Group</label>
              <input
                v-model="editableStudent.student_group"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Skate Type</label>
              <input
                v-model="editableStudent.skate_type"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fee Structure</label>
              <input
                v-model="editableStudent.fee_structure"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fee Cycle</label>
              <select
                v-model="editableStudent.fee_cycle"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @change="markAsChanged"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half-yearly">Half-yearly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Next Payment Date</label>
              <input
                v-model="editableStudent.next_payment_date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pending Fee</label>
              <input
                v-model="editableStudent.pending_fee"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="flex items-center space-x-2">
                <input
                  v-model="editableStudent.transportation"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  @change="markAsChanged"
                />
                <span class="text-sm font-medium text-gray-700">Transportation Required</span>
              </label>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                v-model="editableStudent.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @change="markAsChanged"
              >
                <option value="active">Active</option>
                <option value="passive">Passive</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="mt-8 space-y-4">
          <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Address Information
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
              <input
                v-model="editableStudent.address_line1"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
              <input
                v-model="editableStudent.address_line2"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                v-model="editableStudent.city"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">State *</label>
              <input
                v-model="editableStudent.state"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
              <input
                v-model="editableStudent.postal_code"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Country *</label>
              <input
                v-model="editableStudent.country"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>
          </div>
        </div>

        <!-- Fee Information -->
        <div class="mt-8 space-y-4">
          <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Latest Fee Information
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
              <input
                v-model="editableStudent.transaction_id"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
              <input
                v-model="editableStudent.amount_paid"
                type="number"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
              <select
                v-model="editableStudent.payment_mode"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @change="markAsChanged"
              >
                <option value="admin_manual">Admin Manual</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="bank">Bank</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                v-model="editableStudent.payment_status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @change="markAsChanged"
              >
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
              <input
                v-model="editableStudent.payment_date"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              />
            </div>

            <div class="lg:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                v-model="editableStudent.remarks"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @input="markAsChanged"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'

export default {
  name: 'ManageStudents',
  setup() {
    const loading = ref(false)
    const students = ref([])
    const selectedStudent = ref(null)
    const editableStudent = reactive({})
    const originalStudent = ref({})
    const hasChanges = ref(false)
    const downloadingStudentId = ref(null)

    // Fetch all students for the table
    const fetchStudents = async () => {
      loading.value = true
      try {
        const response = await fetch('http://localhost:3000/vsa/admin/get-students-for-managing', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (data.success) {
          students.value = data.studentDetails
        } else {
          console.error('Failed to fetch students:', data.message)
        }
      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        loading.value = false
      }
    }

    // Fetch individual student details
    const fetchStudentDetails = async (studentId) => {
      loading.value = true
      try {
        const response = await fetch(
          `http://localhost:3000/vsa/admin/get-student-for-managing?studentId=${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          },
        )

        const data = await response.json()

        if (data.success && data.studentDetail.length > 0) {
          const student = data.studentDetail[0]
          selectedStudent.value = student

          // Copy all properties to editable student
          Object.keys(student).forEach((key) => {
            editableStudent[key] = student[key]
          })

          // Handle special cases for form fields
          if (editableStudent.dob) {
            editableStudent.dob = new Date(editableStudent.dob).toISOString().split('T')[0]
          }
          if (editableStudent.next_payment_date) {
            editableStudent.next_payment_date = new Date(editableStudent.next_payment_date)
              .toISOString()
              .split('T')[0]
          }
          if (editableStudent.payment_date) {
            editableStudent.payment_date = new Date(editableStudent.payment_date)
              .toISOString()
              .split('T')[0]
          }

          // Store original data for comparison
          originalStudent.value = JSON.parse(JSON.stringify(editableStudent))
          hasChanges.value = false
        }
      } catch (error) {
        console.error('Error fetching student details:', error)
      } finally {
        loading.value = false
      }
    }

    // Download fee history (PDF or CSV)
    const downloadFeeHistory = async (studentId, format) => {
      downloadingStudentId.value = studentId
      try {
        const endpoint = format === 'pdf' 
          ? `http://localhost:3000/vsa/admin/download-student-fee-history-pdf/${studentId}`
          : `http://localhost:3000/vsa/admin/download-student-fee-history-csv/${studentId}`

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Download failed')
        }

        // Get the blob from response
        const blob = await response.blob()
        
        // Create a download link
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `student-${studentId}-fee-history.${format}`
        document.body.appendChild(a)
        a.click()
        
        // Cleanup
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
      } catch (error) {
        console.error('Error downloading fee history:', error)
        alert(`Failed to download ${format.toUpperCase()}: ${error.message}`)
      } finally {
        downloadingStudentId.value = null
      }
    }

    // saveChanges method for the Vue component
    const saveChanges = async () => {
      loading.value = true
      try {
        // Only include fields that have actually changed
        const updateData = { student_id: editableStudent.student_id }

        // Compare each field and only include changed ones
        Object.keys(editableStudent).forEach((key) => {
          if (key !== 'student_id' && editableStudent[key] !== originalStudent.value[key]) {
            // Handle special case for class field (reserved keyword)
            if (key === 'class') {
              updateData[key] = editableStudent[key]
            } else {
              updateData[key] = editableStudent[key]
            }
          }
        })

        // If no changes detected, don't make API call
        if (Object.keys(updateData).length === 1) {
          // Only student_id
          alert('No changes detected to save.')
          loading.value = false
          return
        }

        console.log('Sending update data:', updateData) // For debugging

        const response = await fetch('http://localhost:3000/vsa/admin/update-student', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        })

        const data = await response.json()

        if (data.success) {
          // Update the original student data to reflect saved changes
          originalStudent.value = JSON.parse(JSON.stringify(editableStudent))
          hasChanges.value = false

          // Show success message
          alert('Student updated successfully!')

          // Optionally refresh the student list
          await fetchStudents()
        } else {
          alert(`Error updating student: ${data.message}`)
        }
      } catch (error) {
        console.error('Error saving student:', error)
        alert('Failed to save changes. Please try again.')
      } finally {
        loading.value = false
      }
    }

    // markAsChanged method to be more precise
    const markAsChanged = () => {
      // Check if any field has actually changed from the original
      let hasChanged = false
      for (const key in editableStudent) {
        if (editableStudent[key] !== originalStudent.value[key]) {
          hasChanged = true
          break
        }
      }
      hasChanges.value = hasChanged
    }

    // Reset changes
    const resetChanges = () => {
      Object.keys(originalStudent.value).forEach((key) => {
        editableStudent[key] = originalStudent.value[key]
      })
      hasChanges.value = false
    }

    // Go back to students list
    const goBack = () => {
      if (hasChanges.value) {
        if (confirm('You have unsaved changes. Are you sure you want to go back?')) {
          selectedStudent.value = null
          hasChanges.value = false
        }
      } else {
        selectedStudent.value = null
      }
    }

    // Load students on component mount
    onMounted(() => {
      fetchStudents()
    })

    return {
      loading,
      students,
      selectedStudent,
      editableStudent,
      hasChanges,
      downloadingStudentId,
      fetchStudentDetails,
      downloadFeeHistory,
      markAsChanged,
      saveChanges,
      resetChanges,
      goBack,
    }
  },
}
</script>
