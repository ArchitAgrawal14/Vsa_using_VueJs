<template>
  <div class="register-student-container">
    <div class="form-header">
      <h2></h2>
      <p></p>
    </div>

    <form @submit.prevent="submitForm" class="student-form">
      <!-- Personal Information Section -->
      <div class="form-section">
        <h3>Personal Information</h3>

        <div class="form-row">
          <div class="form-group">
            <label for="studentImage">Student Photo</label>
            <input
              type="file"
              id="studentImage"
              ref="imageInput"
              @change="handleImageSelect"
              accept="image/*"
              class="file-input"
            />
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="Preview" />
              <button type="button" @click="removeImage" class="remove-image">×</button>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group required">
            <label for="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              v-model="formData.fullName"
              :class="{ error: errors.fullName }"
              placeholder="Enter full name"
              required
            />
            <span v-if="errors.fullName" class="error-text">{{ errors.fullName }}</span>
          </div>

          <div class="form-group">
            <label for="gender">Gender *</label>
            <select
              id="gender"
              v-model="formData.gender"
              :class="{ error: errors.gender }"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <span v-if="errors.gender" class="error-text">{{ errors.gender }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="fatherName">Father's Name</label>
            <input
              type="text"
              id="fatherName"
              v-model="formData.fatherName"
              placeholder="Enter father's name"
            />
          </div>

          <div class="form-group">
            <label for="motherName">Mother's Name</label>
            <input
              type="text"
              id="motherName"
              v-model="formData.motherName"
              placeholder="Enter mother's name"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group required">
            <label for="dob">Date of Birth *</label>
            <input
              type="date"
              id="dob"
              v-model="formData.dob"
              :class="{ error: errors.dob }"
              required
            />
            <span v-if="errors.dob" class="error-text">{{ errors.dob }}</span>
          </div>

          <div class="form-group">
            <label for="dateOfJoining">Date of Joining</label>
            <input type="date" id="dateOfJoining" v-model="formData.dateOfJoining" />
          </div>
        </div>
      </div>

      <!-- Contact Information Section -->
      <div class="form-section">
        <h3>Contact Information</h3>

        <div class="form-row">
          <div class="form-group required">
            <label for="email">Email *</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              :class="{ error: errors.email }"
              placeholder="student@example.com"
              required
            />
            <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
          </div>

          <div class="form-group required">
            <label for="mobileNumber">Mobile Number *</label>
            <input
              type="tel"
              id="mobileNumber"
              v-model="formData.mobileNumber"
              :class="{ error: errors.mobileNumber }"
              placeholder="1234567890"
              maxlength="10"
              required
            />
            <span v-if="errors.mobileNumber" class="error-text">{{ errors.mobileNumber }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="whatsappNumber">WhatsApp Number *</label>
            <input
              type="tel"
              id="whatsappNumber"
              v-model="formData.whatsappNumber"
              :class="{ error: errors.whatsappNumber }"
              placeholder="1234567890"
              maxlength="10"
              required
            />
            <span v-if="errors.whatsappNumber" class="error-text">{{ errors.whatsappNumber }}</span>
          </div>
        </div>
      </div>

      <!-- Academic Information Section -->
      <div class="form-section">
        <h3>Academic Information</h3>

        <div class="form-row">
          <div class="form-group required">
            <label for="className">Class *</label>
            <input
              type="text"
              id="className"
              v-model="formData.className"
              :class="{ error: errors.className }"
              placeholder="e.g., 10th, 12th"
              required
            />
            <span v-if="errors.className" class="error-text">{{ errors.className }}</span>
          </div>

          <div class="form-group">
            <label for="schoolName">School Name</label>
            <input
              type="text"
              id="schoolName"
              v-model="formData.schoolName"
              placeholder="Enter school name"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="studentGroup">Student Group</label>
            <input
              type="text"
              id="studentGroup"
              v-model="formData.studentGroup"
              placeholder="Enter student group"
            />
          </div>

          <div class="form-group">
            <label for="skateType">Skate Type</label>
            <input
              type="text"
              id="skateType"
              v-model="formData.skateType"
              placeholder="Enter skate type"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="hobbies">Hobbies (comma separated)(Optional)</label>
            <input
              type="text"
              id="hobbies"
              v-model="hobbiesInput"
              placeholder="Reading, Sports, Music"
            />
          </div>
        </div>
      </div>

      <!-- Fee Information Section -->
      <div class="form-section">
        <h3>Fee Information</h3>

        <div class="form-row">
          <div class="form-group">
            <label for="feeStructure">Fee Structure (₹)</label>
            <input
              type="number"
              id="feeStructure"
              v-model.number="formData.feeStructure"
              :class="{ error: errors.feeStructure }"
              placeholder="Enter fee amount"
              min="1"
            />
            <span v-if="errors.feeStructure" class="error-text">{{ errors.feeStructure }}</span>
          </div>

          <div class="form-group">
            <label for="feeCycle">Fee Cycle</label>
            <select id="feeCycle" v-model="formData.feeCycle" :class="{ error: errors.feeCycle }">
              <option value="">Select Fee Cycle</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Half-Yearly">Half-Yearly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <span v-if="errors.feeCycle" class="error-text">{{ errors.feeCycle }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="amountPaid">Initial Amount Paid (₹)</label>
            <input
              type="number"
              id="amountPaid"
              v-model.number="formData.amountPaid"
              placeholder="Enter amount paid"
              min="0"
            />
          </div>

          <div class="form-group">
            <label for="paymentMode">Payment Mode</label>
            <select id="paymentMode" v-model="formData.paymentMode">
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="remarks">Payment Remarks</label>
            <textarea
              id="remarks"
              v-model="formData.remarks"
              placeholder="Any additional remarks about the payment"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="cycleStartDate">Fee Cycle start date</label>
            <input type="date" id="cycleStartDate" v-model="formData.cycleStartDate" />
          </div>
        </div>
      </div>

      <!-- Address Information Section -->
      <div class="form-section">
        <h3>Address Information (Optional)</h3>

        <div class="form-row">
          <div class="form-group">
            <label for="addressLine1">Address Line 1</label>
            <input
              type="text"
              id="addressLine1"
              v-model="formData.addressLine1"
              placeholder="House/Flat number, Street name"
            />
          </div>

          <div class="form-group">
            <label for="addressLine2">Address Line 2</label>
            <input
              type="text"
              id="addressLine2"
              v-model="formData.addressLine2"
              placeholder="Area, Landmark"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="city">City</label>
            <input type="text" id="city" v-model="formData.city" placeholder="Enter city" />
          </div>

          <div class="form-group">
            <label for="state">State</label>
            <input type="text" id="state" v-model="formData.state" placeholder="Enter state" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              v-model="formData.postalCode"
              :class="{ error: errors.postalCode }"
              placeholder="123456"
              maxlength="6"
            />
            <span v-if="errors.postalCode" class="error-text">{{ errors.postalCode }}</span>
          </div>

          <div class="form-group">
            <label for="country">Country</label>
            <input type="text" id="country" v-model="formData.country" placeholder="Bharat" />
          </div>
        </div>
      </div>

      <!-- Additional Options Section -->
      <div class="form-section">
        <h3>Additional Options</h3>

        <div class="form-row">
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="formData.transportation" />
              Transportation Required
            </label>
          </div>

          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="formData.status">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="form-actions">
        <button type="button" @click="resetForm" class="btn-secondary">Reset Form</button>
        <button type="submit" :disabled="isSubmitting" class="btn-primary">
          {{ isSubmitting ? 'Registering...' : 'Register Student' }}
        </button>
      </div>

      <!-- Success/Error Messages -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RegisterNewStudent',
  data() {
    return {
      formData: {
        fullName: '',
        fatherName: '',
        motherName: '',
        email: '',
        mobileNumber: '',
        whatsappNumber: '',
        dob: '',
        dateOfJoining: '',
        className: '',
        gender: '',
        schoolName: '',
        hobbies: [],
        studentGroup: '',
        skateType: '',
        feeStructure: null,
        feeCycle: '',
        amountPaid: 0,
        paymentMode: 'cash',
        remarks: '',
        cycleStartDate: '',
        transportation: false,
        status: 'Active',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Bharat',
      },
      selectedImage: null,
      imagePreview: null,
      hobbiesInput: '',
      errors: {},
      isSubmitting: false,
      successMessage: '',
      errorMessage: '',
      toast: {
        show: false,
        message: '',
        type: 'info', // 'success', 'error', 'info'
        timeout: null,
      },
    }
  },
  watch: {
    hobbiesInput(newVal) {
      this.formData.hobbies = newVal
        ? newVal
            .split(',')
            .map((h) => h.trim())
            .filter((h) => h)
        : []
    },
  },
  beforeUnmount() {
    // Clean up timeout when component is destroyed
    if (this.toast.timeout) {
      clearTimeout(this.toast.timeout)
    }
  },
  methods: {
    handleImageSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedImage = file

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },

    removeImage() {
      this.selectedImage = null
      this.imagePreview = null
      this.$refs.imageInput.value = ''
    },
    validateForm() {
      const errors = {}
      // fullName
      if (!this.formData.fullName || this.formData.fullName.trim().length < 2) {
        errors.fullName = 'Full name is required and must be at least 2 characters long'
      }

      // fatherName
      if (this.formData.fatherName && typeof this.formData.fatherName !== 'string') {
        errors.fatherName = 'Father name must be a string'
      }

      // motherName
      if (this.formData.motherName && typeof this.formData.motherName !== 'string') {
        errors.motherName = 'Mother name must be a string'
      }

      // email
      if (!this.formData.email) {
        errors.email = 'Email is required'
      } else if (!/^\S+@\S+\.\S+$/.test(this.formData.email)) {
        errors.email = 'Invalid email format'
      }

      // mobileNumber (keeping typo from server)
      if (!this.formData.mobileNumber) {
        errors.mobileNumber = 'Mobile number is required'
      } else if (!/^\d{10}$/.test(this.formData.mobileNumber)) {
        errors.mobileNumber = 'Mobile number must be 10 digits'
      }

      // whatsappNumber
      if (this.formData.whatsappNumber && !/^\d{10}$/.test(this.formData.whatsappNumber)) {
        errors.whatsappNumber = 'WhatsApp number must be 10 digits'
      }

      // dob
      if (!this.formData.dob) {
        errors.dob = 'Date of birth is required'
      } else if (isNaN(Date.parse(this.formData.dob))) {
        errors.dob = 'Invalid date of birth format'
      }

      // className
      if (!this.formData.className) {
        errors.className = 'Class is required'
      }

      // gender
      if (!this.formData.gender) {
        errors.gender = 'Gender is required'
      } else if (!['Male', 'Female', 'Other'].includes(this.formData.gender)) {
        errors.gender = 'Gender must be Male, Female, or Other'
      }

      // feeCycle
      if (
        this.formData.feeCycle &&
        !['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'].includes(this.formData.feeCycle)
      ) {
        errors.feeCycle = 'Fee cycle must be Monthly, Quarterly, Half-Yearly, or Yearly'
      }

      // feeStructure
      if (this.formData.feeStructure && this.formData.feeStructure <= 0) {
        errors.feeStructure = 'Fee structure must be greater than 0'
      }

      // postalCode
      if (this.formData.postalCode && !/^\d{6}$/.test(this.formData.postalCode)) {
        errors.postalCode = 'Postal code must be 6 digits'
      }

      this.errors = errors
      return Object.keys(errors).length === 0
    },

    async submitForm() {
      if (!this.validateForm()) {
        this.showToast('Please fix the errors before submitting.', 'error')
        return
      }

      this.isSubmitting = true

      try {
        if (!this.formData.dateOfJoining) {
          this.formData.dateOfJoining = new Date().toISOString().split('T')[0]
        }

        if (!this.formData.cycleStartDate) {
          this.formData.cycleStartDate = new Date().toISOString().split('T')[0]
        }

        const formData = new FormData()
        Object.keys(this.formData).forEach((key) => {
          if (this.formData[key] !== null && this.formData[key] !== '') {
            formData.append(key, this.formData[key])
          }
        })

        if (this.selectedImage) {
          formData.append('studentImage', this.selectedImage)
        }

        // Set dateOfJoining to today if not provided
        if (!this.formData.dateOfJoining) {
          this.formData.dateOfJoining = new Date().toISOString().split('T')[0]
        }

        // Set cycleStartDate to today if not provided
        if (!this.formData.cycleStartDate) {
          this.formData.cycleStartDate = new Date().toISOString().split('T')[0]
        }
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        const response = await fetch('http://localhost:3000/vsa/admin/register-new-student', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        const result = await response.json()

        if (result.success) {
          const successMsg =
            result.message ||
            `Student registered successfully! Student ID: ${result.data.studentId}`
          this.showToast(successMsg, 'success', 6000)
          this.resetForm()
        } else {
          // Handle validation errors from backend
          if (result.validationErrors && Array.isArray(result.validationErrors)) {
            const errorMsg = result.validationErrors.join('. ')
            this.showToast(errorMsg, 'error', 7000)
          } else {
            const errorMsg = result.message || 'Registration failed. Please try again.'
            this.showToast(errorMsg, 'error')
          }
        }
      } catch (error) {
        this.showToast('Network error. Please check your connection and try again.', 'error')
        console.error('Registration error:', error)
      } finally {
        this.isSubmitting = false
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
        dateOfJoining: '',
        className: '',
        gender: '',
        schoolName: '',
        hobbies: [],
        studentGroup: '',
        skateType: '',
        feeStructure: null,
        feeCycle: '',
        amountPaid: 0,
        paymentMode: 'cash',
        remarks: '',
        cycleStartDate: '',
        transportation: false,
        status: 'Active',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Bharat',
      }
      this.hobbiesInput = ''
      this.errors = {}
      this.selectedImage = null
      this.imagePreview = null
      this.$refs.imageInput.value = ''
    },

    showToast(message, type = 'info', duration = 5000) {
      // Clear existing timeout
      if (this.toast.timeout) {
        clearTimeout(this.toast.timeout)
      }

      this.toast.message = message
      this.toast.type = type
      this.toast.show = true

      // Auto-hide after duration
      this.toast.timeout = setTimeout(() => {
        this.hideToast()
      }, duration)
    },

    hideToast() {
      this.toast.show = false
      if (this.toast.timeout) {
        clearTimeout(this.toast.timeout)
        this.toast.timeout = null
      }
    },
  },
}
</script>

<style scoped>
.register-student-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, white 0%, white 100%);
  color: white;
  border-radius: 10px;
}

.form-header h2 {
  margin: 0 0 10px 0;
  font-size: 2rem;
}

.form-header p {
  margin: 0;
  opacity: 0.9;
}

.student-form {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-section {
  padding: 30px;
  border-bottom: 1px solid #e5e5e5;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.3rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.required label::after {
  content: ' *';
  color: #e74c3c;
}

label {
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
}
.file-input {
  padding: 8px;
  border: 2px dashed #e1e8ed;
  border-radius: 6px;
  cursor: pointer;
}

.image-preview {
  position: relative;
  margin-top: 10px;
  display: inline-block;
}

.image-preview img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e1e8ed;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
input,
select,
textarea {
  padding: 12px;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

input.error,
select.error {
  border-color: #e74c3c;
}

.error-text {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 8px;
  width: auto;
}

.form-actions {
  padding: 30px;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  background-color: #f8f9fa;
}

.btn-primary,
.btn-secondary {
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-2px);
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 6px;
  margin: 20px 30px;
  border: 1px solid #c3e6cb;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 6px;
  margin: 20px 30px;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .register-student-container {
    padding: 10px;
  }

  .form-section {
    padding: 20px;
  }
}
</style>
