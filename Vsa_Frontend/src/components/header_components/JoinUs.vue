<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8 mt-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Join Vaibhav Skating Academy</h1>
        <p class="text-gray-600">Register your child for an exciting skating journey</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading...</p>
      </div>

      <!-- Success Message -->
      <div v-else-if="successMessage" class="bg-white rounded-lg shadow-lg p-8 text-center">
        <div
          class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
        <p class="text-gray-600 mb-4">{{ successMessage }}</p>
        <button
          @click="resetForm"
          class="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Register Another Student
        </button>
      </div>

      <!-- Registration Form -->
      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <!-- Error Messages -->
        <div v-if="errors.length > 0" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 class="text-red-800 font-semibold mb-2">Please fix the following errors:</h3>
          <ul class="list-disc list-inside text-red-700 text-sm space-y-1">
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
        </div>

        <!-- Student Photo Upload -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
            Student Photo
          </h2>
          <div class="flex flex-col sm:flex-row items-center gap-6">
            <div
              class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center"
            >
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Preview"
                class="w-full h-full object-cover"
              />
              <svg
                v-else
                class="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Upload Student Photo</label
              >
              <input
                type="file"
                @change="handleImageChange"
                accept="image/*"
                class="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800 file:cursor-pointer"
              />
              <p class="mt-2 text-xs text-gray-500">JPG, PNG or GIF (MAX. 5MB)</p>
            </div>
          </div>
        </div>

        <!-- Personal Information -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
            Personal Information
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                v-model="formData.fullName"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input
                v-model="formData.dob"
                type="date"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                v-model="formData.gender"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Class *</label>
              <input
                v-model="formData.className"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="e.g., 5th"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">School Name</label>
              <input
                v-model="formData.schoolName"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="Enter school name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Hobbies</label>
              <input
                v-model="formData.hobbies"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="e.g., Drawing, Reading"
              />
            </div>
          </div>
        </div>

        <!-- Parent Information -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
            Parent Information
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
              <input
                v-model="formData.fatherName"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="Enter father's name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mother's Name</label>
              <input
                v-model="formData.motherName"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="Enter mother's name"
              />
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
            Contact Information
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                v-model="formData.email"
                type="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
              <input
                v-model="formData.mobileNumber"
                type="tel"
                required
                maxlength="10"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="10-digit mobile number"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
              <input
                v-model="formData.whatsappNumber"
                type="tel"
                maxlength="10"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="10-digit WhatsApp number"
              />
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
            Address Information
          </h2>
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
              <input
                v-model="formData.addressLine1"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="House/Flat No., Street"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
              <input
                v-model="formData.addressLine2"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="Landmark, Area"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  v-model="formData.city"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                  placeholder="City"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  v-model="formData.state"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                  placeholder="State"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                <input
                  v-model="formData.postalCode"
                  type="text"
                  maxlength="6"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                  placeholder="6-digit PIN"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  v-model="formData.country"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                  placeholder="Country"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Skating & Fee Details -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
            Skating & Fee Details
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date of Joining</label>
              <input
                v-model="formData.dateOfJoining"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              />
            </div>
            <!-- Fee Cycle Dropdown -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fee Cycle *</label>
              <select
                v-model="formData.selectedProgramId"
                @change="updateFeeStructure"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select Fee Cycle</option>
                <option v-for="program in programsData" :key="program.id" :value="program.id">
                  {{ formatFeeCycle(program.fee_cycle) }} - ₹{{ program.price }}
                </option>
              </select>
            </div>

            <!-- Fee Amount -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Fee Amount (₹) *</label>
              <input
                v-model.number="formData.feeStructure"
                type="number"
                required
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all"
                placeholder="Enter fee amount"
                readonly
              />
            </div>
          </div>
        </div>

        <!-- Payment Option -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
            Payment Option
          </h2>
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <label class="flex items-center cursor-pointer">
              <input
                v-model="formData.isPayingNow"
                type="checkbox"
                class="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-900"
              />
              <span class="ml-3 text-gray-700">I want to pay now (Online Payment)</span>
            </label>
            <p class="mt-2 text-sm text-gray-500 ml-8">
              {{
                formData.isPayingNow
                  ? 'You will be redirected to payment gateway'
                  : 'You can pay later in cash to the teacher'
              }}
            </p>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg
              v-if="submitting"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ submitting ? 'Registering...' : 'Register Student' }}
          </button>
          <button
            type="button"
            @click="resetForm"
            class="sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JoinUs',
  data() {
    return {
      loading: false,
      submitting: false,
      errors: [],
      successMessage: '',
      imagePreview: null,
      selectedFile: null,
      formData: {
        fullName: '',
        fatherName: '',
        motherName: '',
        email: '',
        mobileNumber: '',
        whatsappNumber: '',
        dob: '',
        className: '',
        gender: '',
        schoolName: '',
        hobbies: '',
        dateOfJoining: new Date().toISOString().split('T')[0],
        addressLine1: '',
        addressLine2: '',
        city: 'Satna',
        state: 'Madhya Pradesh',
        postalCode: '485001',
        country: 'Bharat',
        feeStructure: '',
        feeCycle: 'monthly',
        isPayingNow: false,
        selectedProgramId: '',
      },
      programsData: [],
    }
  },
  mounted() {
    this.fetchUserDetails()
  },
  methods: {
    async fetchUserDetails() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3000/vsa/join-us', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
        })

        const data = await response.json()

        if (data.success && data.userDetail && data.userDetail.length > 0) {
          const user = data.userDetail[0]
          // Prefill user data
          this.formData.email = user.email || this.formData.email
          this.formData.mobileNumber = user.mobile || this.formData.mobileNumber
          this.formData.addressLine1 = user.address_line1 || this.formData.addressLine1
          this.formData.addressLine2 = user.address_line2 || this.formData.addressLine2
          this.formData.city = user.city || this.formData.city
          this.formData.state = user.state || this.formData.state
          this.formData.postalCode = user.postal_code || this.formData.postalCode
          this.formData.country = user.country || this.formData.country
        }
        // Store programs data
        if (data.programsData && data.programsData.length > 0) {
          this.programsData = data.programsData
          
          // Check if there's a programId in the URL query parameters
          const queryProgramId = this.$route.query.programId
          
          if (queryProgramId) {
            // Convert to number for comparison
            const programId = parseInt(queryProgramId)
            
            // Find the program in the list
            const selectedProgram = this.programsData.find(p => p.id === programId)
            
            if (selectedProgram) {
              // Auto-select the program
              this.formData.selectedProgramId = selectedProgram.id
              this.formData.feeCycle = selectedProgram.fee_cycle
              this.formData.feeStructure = selectedProgram.price
              
              console.log('Auto-selected program:', selectedProgram)
            }
          } else if (data.userDetail && data.userDetail.length > 0 && data.userDetail[0].program_id) {
            // Fallback: If there's existing program data for the user, prefill it
            this.formData.selectedProgramId = data.userDetail[0].program_id
            this.formData.feeCycle = data.userDetail[0].fee_cycle
            this.formData.feeStructure = data.userDetail[0].price
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error)
      } finally {
        this.loading = false
      }
    },

    handleImageChange(event) {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          this.errors.push('Image size must be less than 5MB')
          return
        }

        this.selectedFile = file
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },

    validateForm() {
      this.errors = []

      if (!this.formData.fullName || this.formData.fullName.trim().length < 2) {
        this.errors.push('Full name is required and must be at least 2 characters long')
      }

      if (!this.formData.email || !/^\S+@\S+\.\S+$/.test(this.formData.email)) {
        this.errors.push('Valid email is required')
      }

      if (!this.formData.mobileNumber || !/^\d{10}$/.test(this.formData.mobileNumber)) {
        this.errors.push('Mobile number must be 10 digits')
      }

      if (this.formData.whatsappNumber && !/^\d{10}$/.test(this.formData.whatsappNumber)) {
        this.errors.push('WhatsApp number must be 10 digits')
      }

      if (!this.formData.dob) {
        this.errors.push('Date of birth is required')
      }

      if (!this.formData.className) {
        this.errors.push('Class is required')
      }

      if (!this.formData.gender) {
        this.errors.push('Gender is required')
      }

      if (this.formData.postalCode && !/^\d{6}$/.test(this.formData.postalCode)) {
        this.errors.push('Postal code must be 6 digits')
      }

      if (!this.formData.feeStructure || this.formData.feeStructure <= 0) {
        this.errors.push('Fee amount is required and must be greater than 0')
      }

      if (!this.formData.feeCycle) {
        this.errors.push('Fee cycle is required')
      }

      return this.errors.length === 0
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      this.submitting = true
      this.errors = []

      try {
        const formDataToSend = new FormData()

        // Add student data as JSON string
        formDataToSend.append('studentData', JSON.stringify(this.formData))

        // Add image if selected
        if (this.selectedFile) {
          formDataToSend.append('studentImage', this.selectedFile)
        }

        const response = await fetch('http://localhost:3000/vsa/join-us', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`,
          },
          body: formDataToSend,
        })

        const data = await response.json()

        if (data.success) {
          this.successMessage = data.message
          if (data.data) {
            this.successMessage += ` Student ID: ${data.data.studentId}`
            if (data.data.nextPaymentDate) {
              this.successMessage += `. Next payment due: ${data.data.nextPaymentDate}`
            }
          }
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          if (data.validationErrors) {
            this.errors = data.validationErrors
          } else {
            this.errors = [data.message || 'Registration failed. Please try again.']
          }
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } catch (error) {
        console.error('Registration error:', error)
        this.errors = ['An error occurred during registration. Please try again.']
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } finally {
        this.submitting = false
      }
    },

    resetForm() {
      this.formData = {
        fullName: '',
        fatherName: '',
        motherName: '',
        email: '',
        mobileNumber: '',
        whatsappNumber: '',
        dob: '',
        className: '',
        gender: '',
        schoolName: '',
        hobbies: '',
        dateOfJoining: new Date().toISOString().split('T')[0],
        addressLine1: '',
        addressLine2: '',
        city: 'Satna',
        state: 'Madhya Pradesh',
        postalCode: '485001',
        country: 'Bharat',
        feeStructure: '',
        feeCycle: 'monthly',
        selectedProgramId: '',
        isPayingNow: false,
      }
      this.imagePreview = null
      this.selectedFile = null
      this.errors = []
      this.successMessage = ''
      this.fetchUserDetails()
    },

    getAuthToken() {
      return localStorage.getItem('token') || ''
    },

    updateFeeStructure(event) {
      const selectedProgramId = parseInt(event.target.value)
      
      if (selectedProgramId) {
        const selectedProgram = this.programsData.find(p => p.id === selectedProgramId)
        
        if (selectedProgram) {
          this.formData.feeCycle = selectedProgram.fee_cycle
          this.formData.feeStructure = selectedProgram.price
        }
      } else {
        this.formData.feeCycle = ''
        this.formData.feeStructure = 0
      }
    },

    formatFeeCycle(cycle) {
      // Capitalize first letter of each word
      return cycle
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },
  },
}
</script>

<style scoped>
/* Additional custom styles if needed */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
