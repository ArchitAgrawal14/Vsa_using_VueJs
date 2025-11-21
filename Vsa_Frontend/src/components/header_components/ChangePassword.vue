<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Card Container -->
      <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <!-- Header -->
        <div class="text-center space-y-2">
          <div class="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Change Password</h1>
          <p class="text-sm text-gray-500">{{ step === 1 ? 'Request OTP to change your password' : 'Enter OTP and new password' }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
          {{ successMessage }}
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {{ errorMessage }}
        </div>

        <!-- Step 1: Request OTP -->
        <form v-if="step === 1" @submit.prevent="requestOTP" class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              v-model="email"
              type="email"
              required
              disabled
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition bg-gray-50 text-gray-700"
              placeholder="your@email.com"
            />
            <p class="text-xs text-gray-500">OTP will be sent to your registered email</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span v-if="loading">Sending...</span>
            <span v-else>Send OTP</span>
          </button>
        </form>

        <!-- Step 2: Verify OTP & Change Password -->
        <form v-if="step === 2" @submit.prevent="verifyAndChange" class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Enter OTP</label>
            <input
              v-model="otp"
              type="text"
              maxlength="6"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition text-center text-2xl tracking-widest font-mono"
              placeholder="000000"
            />
            <p class="text-xs text-gray-500">Check your email for the 6-digit OTP</p>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">New Password</label>
            <div class="relative">
              <input
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition pr-10"
                placeholder="Enter new password"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg v-if="!showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <div class="relative">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition pr-10"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p class="text-xs text-gray-500">Must be at least 6 characters with letters and numbers</p>
          </div>

          <div class="flex space-x-3">
            <button
              type="button"
              @click="resetForm"
              class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Back
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <span v-if="loading">Updating...</span>
              <span v-else>Change Password</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6">
        <p class="text-xs text-gray-500">
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordChange',
  data() {
    return {
      step: 1,
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
      showNewPassword: false,
      showConfirmPassword: false,
      loading: false,
      successMessage: '',
      errorMessage: '',
      authToken: '' // Set this from your auth state/store
    }
  },
  mounted() {
    // Fetch from localStorage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.email = user.email;
        this.authToken = token;
      } catch (e) {
        console.error('Failed to parse user data:', e);
        this.$router.push('/login');
      }
    } else {
      console.warn('No authentication data found');
      this.$router.push('/login');
    }
  },
  methods: {
    clearMessages() {
      this.successMessage = '';
      this.errorMessage = '';
    },
    
    async requestOTP() {
      this.clearMessages();
      this.loading = true;

      try {
        const response = await fetch('http://localhost:3000/vsa/password-change/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}` // Add your token
          },
          body: JSON.stringify({ email: this.email })
        });

        const data = await response.json();

        if (data.success) {
          this.successMessage = data.message;
          this.step = 2;
        } else {
          this.errorMessage = data.message;
        }
      } catch (error) {
        this.errorMessage = 'Failed to send OTP. Please try again.';
        console.error('Request OTP Error:', error);
      } finally {
        this.loading = false;
      }
    },

    async verifyAndChange() {
      this.clearMessages();

      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/;
      if (!passwordRegex.test(this.newPassword)) {
        this.errorMessage = 'Password must be at least 6 characters with letters and numbers';
        return;
      }

      this.loading = true;

      try {
        const response = await fetch('http://localhost:3000/vsa/password-change/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.authToken}` // Add your token
          },
          body: JSON.stringify({
            otp: this.otp,
            newPassword: this.newPassword,
            confirmPassword: this.confirmPassword
          })
        });

        const data = await response.json();

        if (data.success) {
          this.successMessage = data.message;
          setTimeout(() => {
            // Redirect or emit event
            this.$emit('password-changed');
          }, 2000);
        } else {
          this.errorMessage = data.message;
        }
      } catch (error) {
        this.errorMessage = 'Failed to change password. Please try again.';
        console.error('Verify Password Error:', error);
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      this.step = 1;
      this.otp = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.clearMessages();
    }
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>